import { SpeechifyClient } from '@speechify/api';
import { type NextRequest, NextResponse } from 'next/server';

const client = new SpeechifyClient({
  token: process.env.SPEECHIFY_API_TOKEN || '',
});

const VOICE_CACHE_TTL_MS = 1000 * 60 * 30;

type SpeechifyVoice = Awaited<
  ReturnType<typeof client.tts.voices.list>
>[number];

type NormalizedVoiceModel = {
  languages: Array<{
    locale: string;
    previewAudio: string | null;
  }>;
  name: string;
};

type NormalizedVoice = {
  avatarImage: string | null;
  displayName: string;
  gender: SpeechifyVoice['gender'];
  id: string;
  locale: string;
  models: NormalizedVoiceModel[];
  previewAudio: string | null;
  tags: string[];
  type: SpeechifyVoice['type'];
};

type VoiceCacheEntry = {
  expiresAt: number;
  voices: NormalizedVoice[];
};

let voiceCache: VoiceCacheEntry | null = null;
let voiceCachePromise: Promise<NormalizedVoice[]> | null = null;
let voiceCacheVersion = 0;

function invalidateVoiceCache() {
  voiceCacheVersion += 1;
  voiceCache = null;
  voiceCachePromise = null;
}

function normalizeOptionalString(
  value: string | null | undefined
): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeString(
  value: string | null | undefined,
  fallback = ''
): string {
  return normalizeOptionalString(value) ?? fallback;
}

function normalizeTags(tags: string[] | null | undefined): string[] {
  return (tags ?? []).map((tag) => tag.trim()).filter((tag) => tag.length > 0);
}

function normalizeVoice(voice: SpeechifyVoice): NormalizedVoice {
  return {
    id: normalizeString(voice.id),
    displayName: normalizeString(voice.displayName),
    avatarImage: normalizeOptionalString(voice.avatarImage),
    locale: normalizeString(voice.locale),
    gender: voice.gender,
    tags: normalizeTags(voice.tags),
    previewAudio: normalizeOptionalString(voice.previewAudio),
    type: voice.type,
    models: (voice.models ?? []).map((model) => ({
      name: normalizeString(model.name),
      languages: (model.languages ?? []).map((language) => ({
        locale: normalizeString(language.locale),
        previewAudio: normalizeOptionalString(language.previewAudio),
      })),
    })),
  };
}

function matchesLocaleFilter(
  voiceLocale: string,
  localeFilter: string
): boolean {
  if (!localeFilter) {
    return true;
  }

  const normalizedVoiceLocale = voiceLocale.toLowerCase();
  const normalizedLocaleFilter = localeFilter.toLowerCase();

  return (
    normalizedVoiceLocale === normalizedLocaleFilter ||
    normalizedVoiceLocale.startsWith(`${normalizedLocaleFilter}-`) ||
    normalizedVoiceLocale.startsWith(`${normalizedLocaleFilter}_`)
  );
}

function matchesSearchFilter(
  voice: NormalizedVoice,
  searchFilter: string
): boolean {
  if (!searchFilter) {
    return true;
  }

  const normalizedSearchFilter = searchFilter.toLowerCase();
  const searchHaystacks = [
    voice.id,
    voice.displayName,
    voice.locale,
    voice.gender,
    voice.type,
    ...voice.tags,
    ...voice.models.map((model) => model.name),
    ...voice.models.flatMap((model) =>
      model.languages.map((language) => language.locale)
    ),
  ];

  return searchHaystacks.some((value) =>
    value.toLowerCase().includes(normalizedSearchFilter)
  );
}

function getCachedVoices() {
  if (!voiceCache) {
    return null;
  }

  if (voiceCache.expiresAt <= Date.now()) {
    invalidateVoiceCache();
    return null;
  }

  return voiceCache.voices;
}

async function getVoices() {
  const cachedVoices = getCachedVoices();
  if (cachedVoices) {
    return cachedVoices;
  }

  if (!voiceCachePromise) {
    const cacheVersion = voiceCacheVersion;

    voiceCachePromise = client.tts.voices
      .list()
      .then((voices) => voices.map(normalizeVoice))
      .then((voices) => {
        if (cacheVersion === voiceCacheVersion) {
          voiceCache = {
            expiresAt: Date.now() + VOICE_CACHE_TTL_MS,
            voices,
          };
        }

        return voices;
      })
      .finally(() => {
        if (cacheVersion === voiceCacheVersion) {
          voiceCachePromise = null;
        }
      });
  }

  return voiceCachePromise;
}

export async function GET(request: NextRequest) {
  try {
    const searchFilter =
      request.nextUrl.searchParams.get('search')?.trim() ?? '';
    const localeFilter =
      request.nextUrl.searchParams.get('locale')?.trim() ?? '';
    const normalizedVoices = await getVoices();
    const filteredVoices = normalizedVoices.filter(
      (voice) =>
        matchesLocaleFilter(voice.locale, localeFilter) &&
        matchesSearchFilter(voice, searchFilter)
    );

    return NextResponse.json(
      {
        success: true,
        voices: filteredVoices,
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=300, stale-while-revalidate=1800',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch voices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { voiceId } = await request.json();

    if (!voiceId) {
      return NextResponse.json({ error: 'Missing voiceId' }, { status: 400 });
    }

    // Delete the voice
    await client.tts.voices.delete(voiceId);
    invalidateVoiceCache();

    return NextResponse.json({
      success: true,
      message: 'Voice deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete voice:', error);
    return NextResponse.json(
      { error: 'Failed to delete voice' },
      { status: 500 }
    );
  }
}
