'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import {
  type PendingAction,
  useAuthModalStore,
} from '@/stores/auth-modal-store';
import { Download, Globe2, Loader2, Search, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { VoicePickerCard, type VoicePickerVoice } from './voice-picker-card';

const DEFAULT_VOICE =
  process.env.NEXT_PUBLIC_SPEECHIFY_DEFAULT_VOICE_ID || 'george';
const DEFAULT_LANGUAGE = 'en-US';
const RECOMMENDED_VOICE_LIMIT = 3;

const LANGUAGE_LABELS: Record<string, string> = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'zh-CN': '中文（中国）',
};

const fallbackLanguageDisplay =
  typeof Intl !== 'undefined'
    ? new Intl.DisplayNames(['en'], { type: 'language' })
    : null;
const fallbackRegionDisplay =
  typeof Intl !== 'undefined'
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

type VoiceLanguageModel = {
  languages?: Array<{
    locale?: string | null;
    previewAudio?: string | null;
  }> | null;
};

type VoiceApiRecord = {
  avatarImage?: string | null;
  displayName?: string | null;
  gender?: string | null;
  id?: string | null;
  locale?: string | null;
  models?: VoiceLanguageModel[] | null;
  previewAudio?: string | null;
  tags?: string[] | null;
  type?: string | null;
};

type VoiceApiResponse = {
  voices?: unknown;
};

function getLanguageLabel(locale: string) {
  if (LANGUAGE_LABELS[locale]) {
    return LANGUAGE_LABELS[locale];
  }

  const [languageCode, regionCode] = locale.split('-');
  if (!fallbackLanguageDisplay) {
    return locale;
  }

  const languageName = fallbackLanguageDisplay.of(languageCode);
  const regionName =
    regionCode && fallbackRegionDisplay
      ? fallbackRegionDisplay.of(regionCode.toUpperCase())
      : null;

  if (!languageName) {
    return locale;
  }

  return regionName ? `${languageName} (${regionName})` : languageName;
}

function matchesLocaleFilter(locales: string[], localeFilter: string) {
  if (!localeFilter) {
    return true;
  }

  const normalizedLocaleFilter = localeFilter.toLowerCase();

  return locales.some((locale) => {
    const normalizedLocale = locale.toLowerCase();

    return (
      normalizedLocale === normalizedLocaleFilter ||
      normalizedLocale.startsWith(`${normalizedLocaleFilter}-`) ||
      normalizedLocale.startsWith(`${normalizedLocaleFilter}_`)
    );
  });
}

function getVoiceScore(voice: VoicePickerVoice, language: string) {
  const localeMatch = matchesLocaleFilter(voice.locales, language);
  const languagePrefix = language.split('-')[0].toLowerCase();
  const prefixMatch = voice.locales.some((locale) =>
    locale.toLowerCase().startsWith(languagePrefix)
  );

  return [
    voice.id === DEFAULT_VOICE ? 500 : 0,
    localeMatch ? 120 : 0,
    prefixMatch ? 60 : 0,
    voice.previewAudio ? 40 : 0,
    voice.avatarImage ? 20 : 0,
    voice.tags.length ? 12 : 0,
    voice.type === 'shared' ? 8 : 0,
  ].reduce((total, value) => total + value, 0);
}

function extractVoiceTags(voice: VoiceApiRecord, locales: string[]) {
  const tags = new Set<string>();

  if (voice.gender) {
    tags.add(voice.gender);
  }

  if (voice.type) {
    tags.add(voice.type);
  }

  for (const locale of locales) {
    tags.add(getLanguageLabel(locale));
  }

  for (const tag of voice.tags ?? []) {
    if (tag?.trim()) {
      tags.add(tag.trim());
    }
  }

  return Array.from(tags).slice(0, 4);
}

function normalizeVoice(voice: unknown): VoicePickerVoice | null {
  if (!voice || typeof voice !== 'object') {
    return null;
  }

  const record = voice as VoiceApiRecord;
  const id = record.id?.trim();
  const displayName = record.displayName?.trim();
  const primaryLocale = record.locale?.trim() || DEFAULT_LANGUAGE;

  if (!id || !displayName) {
    return null;
  }

  const locales = new Set<string>([primaryLocale]);
  let previewAudio = record.previewAudio?.trim() || null;

  for (const model of record.models ?? []) {
    for (const language of model.languages ?? []) {
      if (language.locale?.trim()) {
        locales.add(language.locale.trim());
      }

      if (!previewAudio && language.previewAudio?.trim()) {
        previewAudio = language.previewAudio.trim();
      }
    }
  }

  const localeList = Array.from(locales);

  return {
    avatarImage: record.avatarImage?.trim() || null,
    displayName,
    id,
    locale: primaryLocale,
    locales: localeList,
    previewAudio,
    tags: extractVoiceTags(record, localeList),
    type: record.type?.trim() || null,
  };
}

function isVoicePickerVoice(
  voice: VoicePickerVoice | null
): voice is VoicePickerVoice {
  return Boolean(voice);
}

export function TextToSpeechPanel() {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [voices, setVoices] = useState<VoicePickerVoice[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [activePreviewVoiceId, setActivePreviewVoiceId] = useState<
    string | null
  >(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const { open: openAuthModal, setPending: setAuthPending } =
    useAuthModalStore();

  const charCount = useMemo(() => text.length, [text]);
  const searchValue = searchQuery.trim().toLowerCase();

  useEffect(() => {
    const controller = new AbortController();

    const loadVoices = async () => {
      setIsLoadingVoices(true);
      setVoiceError(null);

      try {
        const response = await fetch('/api/voice-clone/voices', {
          signal: controller.signal,
        });
        const data = (await response.json()) as VoiceApiResponse;

        if (!response.ok) {
          throw new Error('Unable to load voices right now.');
        }

        const nextVoices = Array.isArray(data.voices)
          ? data.voices.map(normalizeVoice).filter(isVoicePickerVoice)
          : [];

        setVoices(nextVoices);

        if (!nextVoices.length) {
          setVoiceError('No voices are available right now.');
          return;
        }

        setVoiceId((currentVoiceId) => {
          if (nextVoices.some((voice) => voice.id === currentVoiceId)) {
            return currentVoiceId;
          }

          return (
            nextVoices.find((voice) => voice.id === DEFAULT_VOICE)?.id ||
            nextVoices[0].id
          );
        });
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setVoiceError(
          fetchError instanceof Error
            ? `${fetchError.message} Using the default voice instead.`
            : 'Unable to load voices right now. Using the default voice instead.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingVoices(false);
        }
      }
    };

    void loadVoices();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  const languageOptions = useMemo(() => {
    const locales = new Set<string>(Object.keys(LANGUAGE_LABELS));
    locales.add(language);

    for (const voice of voices) {
      for (const locale of voice.locales) {
        locales.add(locale);
      }
    }

    return Array.from(locales).sort((left, right) =>
      getLanguageLabel(left).localeCompare(getLanguageLabel(right))
    );
  }, [language, voices]);

  const sortedVoices = useMemo(() => {
    return [...voices].sort((left, right) => {
      const scoreDelta =
        getVoiceScore(right, language) - getVoiceScore(left, language);

      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      return left.displayName.localeCompare(right.displayName);
    });
  }, [language, voices]);

  const filteredVoices = useMemo(() => {
    return sortedVoices.filter((voice) => {
      const matchesLanguage = matchesLocaleFilter(voice.locales, language);
      if (!matchesLanguage) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      const voiceText = [
        voice.displayName,
        voice.id,
        ...voice.locales,
        ...voice.tags,
      ]
        .join(' ')
        .toLowerCase();

      return voiceText.includes(searchValue);
    });
  }, [language, searchValue, sortedVoices]);

  const featuredVoices = useMemo(() => {
    return filteredVoices.slice(0, RECOMMENDED_VOICE_LIMIT);
  }, [filteredVoices]);

  const visibleVoices = searchValue ? filteredVoices : featuredVoices;

  const stopPreviewAudio = () => {
    if (!previewAudioRef.current) {
      return;
    }

    previewAudioRef.current.pause();
    previewAudioRef.current.currentTime = 0;
    previewAudioRef.current = null;
    setActivePreviewVoiceId(null);
  };

  const handlePreviewToggle = async (voice: VoicePickerVoice) => {
    if (!voice.previewAudio) {
      return;
    }

    if (activePreviewVoiceId === voice.id) {
      stopPreviewAudio();
      return;
    }

    stopPreviewAudio();

    const previewAudio = new Audio(voice.previewAudio);
    previewAudioRef.current = previewAudio;
    setActivePreviewVoiceId(voice.id);

    const clearActivePreview = () => {
      if (previewAudioRef.current === previewAudio) {
        previewAudioRef.current = null;
      }

      setActivePreviewVoiceId((currentVoiceId) =>
        currentVoiceId === voice.id ? null : currentVoiceId
      );
    };

    previewAudio.addEventListener('ended', clearActivePreview, { once: true });
    previewAudio.addEventListener('error', clearActivePreview, { once: true });

    try {
      await previewAudio.play();
    } catch {
      clearActivePreview();
    }
  };

  const handleVoiceSelect = (voice: VoicePickerVoice) => {
    setVoiceId(voice.id);
    setLanguage((currentLanguage) =>
      matchesLocaleFilter(voice.locales, currentLanguage)
        ? currentLanguage
        : voice.locales[0]
    );
  };

  const requestSpeech = async (inputText: string) => {
    if (!inputText.trim()) {
      return;
    }

    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/tts/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: inputText,
          voiceId,
          language,
          audioFormat: 'mp3',
          model: language.startsWith('en')
            ? 'simba-english'
            : 'simba-multilingual',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          setAuthPending(inputText, 'tts_generate');
          openAuthModal();
          return;
        }

        throw new Error(data?.error || 'Failed to generate speech');
      }

      setAudioUrl(data.audioUrl || null);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : 'Failed to generate speech'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      return;
    }

    if (!isSessionPending && !session?.user) {
      setAuthPending(text, 'tts_generate');
      openAuthModal();
      return;
    }

    await requestSpeech(text);
  };

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{
        pendingAction?: PendingAction;
        pendingText?: string;
      }>;

      if (customEvent.detail?.pendingAction !== 'tts_generate') {
        return;
      }

      const nextText = customEvent.detail?.pendingText || text;
      if (!nextText.trim()) {
        return;
      }

      void requestSpeech(nextText);
    };

    window.addEventListener('auth:login_success', handler as EventListener);
    return () =>
      window.removeEventListener(
        'auth:login_success',
        handler as EventListener
      );
  }, [requestSpeech, text]);

  const handleDownload = () => {
    if (!audioUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `speechify-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <div className="rounded-[28px] bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:shadow-[inset_4px_4px_8px_#1e293b,inset_-4px_-4px_8px_#475569]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Script
              </p>
              <label
                htmlFor="tts-text"
                className="mt-2 block text-lg font-semibold text-slate-900 dark:text-slate-50"
              >
                Enter your text
              </label>
            </div>

            <Badge
              variant="outline"
              className="rounded-full border-slate-200/80 bg-white/70 px-3 py-1 text-[11px] text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
            >
              {charCount} characters
            </Badge>
          </div>

          <Textarea
            id="tts-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type what you want to say..."
            className="mt-4 min-h-52 rounded-[24px] border-slate-200/80 bg-white/75 px-4 py-4 text-base shadow-sm dark:border-slate-700 dark:bg-slate-950/60"
          />
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 dark:shadow-[inset_4px_4px_8px_#1e293b,inset_-4px_-4px_8px_#475569]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Voice
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Choose a voice
            </h3>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
            <div className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Search voices"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search voices"
                className="h-11 rounded-2xl border-slate-200/80 bg-white/70 pl-9 shadow-sm dark:border-slate-700 dark:bg-slate-950/55"
              />
            </div>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200/80 bg-white/70 shadow-sm dark:border-slate-700 dark:bg-slate-950/55">
                <div className="flex min-w-0 items-center gap-2">
                  <Globe2 className="size-4 text-slate-400" />
                  <SelectValue placeholder="Language" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((locale) => (
                  <SelectItem key={locale} value={locale}>
                    {getLanguageLabel(locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 rounded-[24px] border border-white/70 bg-white/70 p-2 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/45">
            <ScrollArea className="h-[214px]">
              <div className="space-y-2.5 pr-3">
                {isLoadingVoices ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`voice-skeleton-${index + 1}`}
                      className="h-24 rounded-[20px] bg-slate-100/90 dark:bg-slate-900/80"
                    />
                  ))
                ) : visibleVoices.length > 0 ? (
                  visibleVoices.map((voice) => (
                    <VoicePickerCard
                      key={voice.id}
                      voice={voice}
                      isPreviewing={activePreviewVoiceId === voice.id}
                      isSelected={voice.id === voiceId}
                      onPreviewToggle={handlePreviewToggle}
                      onSelect={handleVoiceSelect}
                    />
                  ))
                ) : (
                  <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-slate-50/90 px-6 text-center dark:border-slate-700 dark:bg-slate-950/60">
                    <Volume2 className="size-5 text-slate-400" />
                    <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-100">
                      No voices match that search
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Try another keyword or switch the language filter.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {voiceError && (
            <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
              {voiceError}
            </p>
          )}

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim() || !voiceId.trim()}
            className={cn(
              'mt-4 h-11 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-300/40 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:shadow-slate-950/20 dark:hover:bg-slate-100',
              isGenerating && 'cursor-wait'
            )}
          >
            {isGenerating ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Generating
              </span>
            ) : (
              'Generate'
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      )}

      {audioUrl && (
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] dark:from-slate-800 dark:to-slate-900 dark:shadow-[inset_4px_4px_8px_#1e293b,inset_-4px_-4px_8px_#475569]">
          {/* biome-ignore lint/a11y/useMediaCaption: generated download audio does not ship with caption tracks */}
          <audio controls src={audioUrl} className="w-full" />
          <div className="mt-3">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              <Download className="size-4" /> Download audio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
