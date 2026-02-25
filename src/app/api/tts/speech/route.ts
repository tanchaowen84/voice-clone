import {
  checkUsageLimit,
  getCurrentUser,
  getUsageLimitErrorMessage,
  updateUsageStats,
} from '@/lib/subscription-limits';
import { SpeechifyClient } from '@speechify/api';
import { NextRequest, NextResponse } from 'next/server';

const token = process.env.SPEECHIFY_API_KEY || process.env.SPEECHIFY_API_TOKEN || '';

const client = new SpeechifyClient({ token });

const CONTENT_TYPE_BY_FORMAT: Record<string, string> = {
  wav: 'audio/wav',
  mp3: 'audio/mpeg',
  ogg: 'audio/ogg',
  aac: 'audio/aac',
  pcm: 'audio/wav',
};

const ALLOWED_AUDIO_FORMATS = ['wav', 'mp3', 'ogg', 'aac'] as const;
const ALLOWED_MODELS = [
  'simba-base',
  'simba-english',
  'simba-multilingual',
  'simba-turbo',
] as const;

type AllowedAudioFormat = (typeof ALLOWED_AUDIO_FORMATS)[number];
type AllowedModel = (typeof ALLOWED_MODELS)[number];

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export async function POST(request: NextRequest) {
  try {
    if (!token) {
      return NextResponse.json(
        { error: 'Speechify API token is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const inputRaw = asString(body?.input);
    const voiceIdRaw = asString(body?.voiceId) ?? asString(body?.voice_id);
    const languageRaw = asString(body?.language);
    const audioFormatRaw = asString(body?.audioFormat) ?? asString(body?.audio_format);
    const modelRaw = asString(body?.model);

    const input = (inputRaw ?? '').trim();
    const voiceId =
      (voiceIdRaw ?? process.env.SPEECHIFY_DEFAULT_VOICE_ID ?? 'george').trim();
    const language = (languageRaw ?? 'en-US').trim();
    const audioFormat = (audioFormatRaw ?? 'mp3').trim();
    const model = (
      modelRaw ?? (language.startsWith('en') ? 'simba-english' : 'simba-multilingual')
    ).trim();

    if (!inputRaw || !input || !voiceIdRaw || !voiceId) {
      return NextResponse.json(
        { error: 'Missing required string fields: input and voiceId' },
        { status: 400 }
      );
    }

    if (!ALLOWED_AUDIO_FORMATS.includes(audioFormat as AllowedAudioFormat)) {
      return NextResponse.json(
        { error: 'Invalid audioFormat. Allowed: wav, mp3, ogg, aac' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MODELS.includes(model as AllowedModel)) {
      return NextResponse.json(
        {
          error:
            'Invalid model. Allowed: simba-base, simba-english, simba-multilingual, simba-turbo',
        },
        { status: 400 }
      );
    }

    const safeAudioFormat = audioFormat as AllowedAudioFormat;
    const safeModel = model as AllowedModel;

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const usageCheck = await checkUsageLimit(input, currentUser.id);
    if (!usageCheck.allowed) {
      const errorMessage = getUsageLimitErrorMessage(usageCheck);
      return NextResponse.json(
        {
          error: errorMessage,
          reason: usageCheck.reason,
          waitTime: usageCheck.waitTime,
          currentUsage: usageCheck.currentUsage,
          limit: usageCheck.limit,
          remainingQuota: usageCheck.remainingQuota,
        },
        { status: 429 }
      );
    }

    const response = await client.tts.audio.speech({
      input,
      voiceId,
      language,
      audioFormat: safeAudioFormat,
      model: safeModel,
      options: {
        textNormalization: true,
        loudnessNormalization: false,
      },
    });

    if (!response?.audioData) {
      return NextResponse.json(
        { error: 'No audio data returned by Speechify' },
        { status: 502 }
      );
    }

    const billableCharactersCount = response.billableCharactersCount ?? input.length;
    await updateUsageStats(currentUser.id, billableCharactersCount);

    const normalizedFormat = response.audioFormat || audioFormat;
    const contentType = CONTENT_TYPE_BY_FORMAT[normalizedFormat] || 'audio/mpeg';
    const audioUrl = `data:${contentType};base64,${response.audioData}`;

    return NextResponse.json({
      audioUrl,
      audioFormat: normalizedFormat,
      billableCharactersCount,
      usageInfo: {
        currentUsage: (usageCheck.currentUsage || 0) + billableCharactersCount,
        limit: usageCheck.limit,
        remainingQuota: Math.max(
          0,
          (usageCheck.remainingQuota || 0) - billableCharactersCount
        ),
        waitTime: usageCheck.waitTime,
      },
    });
  } catch (error) {
    console.error('[TTS Speech API] failed:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}
