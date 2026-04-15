'use client';

import { FreeUserWaiting } from '@/components/subscription/free-user-waiting';
import { getPlanConfig } from '@/config/subscription-config';
import { authClient } from '@/lib/auth-client';
import {
  type PendingAction,
  useAuthModalStore,
} from '@/stores/auth-modal-store';
import { useSubscriptionStore } from '@/stores/subscription-store';
import { useVoiceCloneStore } from '@/stores/voice-clone-store';
import type { InputMode } from '@/stores/voice-clone-store';
import {
  clearPendingAudio,
  loadPendingAudio,
  savePendingAudio,
} from '@/utils/pending-media';
import { Download, Loader2, Mic, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EnhancedVoiceRecorder } from './enhanced-voice-recorder';
import { FileUploader } from './file-uploader';

const SAMPLE_SCRIPT =
  "\"Hello everyone! I'm trying out Voice Clone technology to create my own voice model. It's really convenient and I'm excited to see how it works!\"";

/**
 * Voice Input Area Component
 * Voice Clone flow: choose mode -> provide sample -> enter text -> generate -> result
 */
export function VoiceInputArea() {
  const {
    inputMode,
    currentStep,
    isGenerating,
    generatedAudioUrl,
    pendingAudioUrl,
    error,
    generateSpeech,
    reset,
    showPendingResult,
    audioFile,
    recordedBlob,
    setAudioFile,
    setRecordedBlob,
    setInputMode,
  } = useVoiceCloneStore();

  const { data: session } = authClient.useSession();
  const { open: openAuthModal, setPending: setAuthPending } =
    useAuthModalStore();

  const { subscription, waitingState, fetchAllData, showUpgradeModal } =
    useSubscriptionStore();
  const [textInput, setTextInput] = useState('');
  const isWaitingForFreePlan =
    waitingState.isWaiting && subscription?.planId === 'free';

  const hasVoiceSample = Boolean(audioFile || recordedBlob);
  const canGenerate =
    currentStep === 'generate' && hasVoiceSample && textInput.trim().length > 0;

  // Determine per-request max characters based on user's plan
  const planMaxChars =
    subscription?.planConfig.limits.maxCharactersPerRequest ??
    getPlanConfig('free').limits.maxCharactersPerRequest;

  // Ensure subscription info is loaded to reflect accurate limits
  useEffect(() => {
    if (!subscription) {
      fetchAllData().catch(() => {
        // noop: gracefully degrade to free limits when unauthenticated or API fails
      });
    }
  }, [subscription, fetchAllData]);

  useEffect(() => {
    if (!isWaitingForFreePlan && pendingAudioUrl) {
      showPendingResult();
    }
  }, [isWaitingForFreePlan, pendingAudioUrl, showPendingResult]);

  const handleGenerateSpeech = async () => {
    if (!textInput.trim()) return;

    // Intercept unauthenticated users: open login modal and mark pending
    if (!session?.user) {
      setAuthPending(textInput, 'voice_clone_generate');
      // Persist media (audio) for recovery across full reloads
      if (inputMode === 'record' || inputMode === 'upload') {
        try {
          if (recordedBlob) {
            await savePendingAudio({
              blob: recordedBlob,
              fileName: 'recorded-voice.webm',
              mimeType: recordedBlob.type || 'audio/webm',
              source: 'recorded',
            });
          } else if (audioFile) {
            await savePendingAudio({
              blob: audioFile,
              fileName: (audioFile as File).name || 'uploaded-audio',
              mimeType: audioFile.type || 'application/octet-stream',
              source: 'uploaded',
            });
          }
        } catch {}
      }
      openAuthModal();
      return;
    }

    await generateSpeech(textInput);
  };

  const handleDownload = () => {
    if (generatedAudioUrl) {
      const link = document.createElement('a');
      link.href = generatedAudioUrl;
      link.download = 'generated-speech.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleStartOver = () => {
    reset();
    setTextInput('');
  };

  const handleDemoText = () => {
    setTextInput(
      'Transform your text into natural-sounding speech with AI voice cloning technology.'
    );
  };

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
  };

  // Auto-continue after login success
  useEffect(() => {
    const handler = async (e: Event) => {
      const ce = e as CustomEvent<{
        pendingAction?: PendingAction;
        pendingText?: string;
      }>;
      if (ce.detail?.pendingAction !== 'voice_clone_generate') {
        return;
      }
      const nextText = ce.detail?.pendingText || textInput;

      // Try to rehydrate pending audio from IndexedDB if any
      try {
        const rec = await loadPendingAudio();
        if (rec) {
          if (rec.source === 'recorded') {
            setRecordedBlob(rec.blob);
          } else {
            const file = new File([rec.blob], rec.fileName, {
              type: rec.mimeType,
            });
            setAudioFile(file);
          }
          await clearPendingAudio();
        }
      } catch {}

      if (nextText?.trim()) {
        generateSpeech(nextText);
      }
    };
    window.addEventListener('auth:login_success', handler as EventListener);
    return () =>
      window.removeEventListener(
        'auth:login_success',
        handler as EventListener
      );
  }, [generateSpeech, setAudioFile, setRecordedBlob, textInput]);

  return (
    <div className="relative rounded-3xl border border-white/60 bg-gradient-to-br from-slate-50/90 to-slate-100/85 p-4 shadow-[10px_10px_30px_rgba(148,163,184,0.18)] backdrop-blur-sm dark:border-slate-700/70 dark:from-slate-900/90 dark:to-slate-800/90 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="mx-auto flex w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white/75 p-1 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/70">
          <button
            type="button"
            onClick={() => handleModeChange('record')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              inputMode === 'record'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Mic className="h-4 w-4" />
            Record
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('upload')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              inputMode === 'upload'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-700/80 dark:bg-slate-900/70 sm:p-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Step 1
              </p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Provide Voice Sample
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {inputMode === 'record'
                  ? 'Record a short clean clip to capture tone and pronunciation.'
                  : 'Upload a clear voice recording. 15 to 30 seconds works best.'}
              </p>
            </div>

            <div className="mt-4">
              {currentStep === 'input' ? (
                inputMode === 'record' ? (
                  <EnhancedVoiceRecorder />
                ) : (
                  <FileUploader />
                )
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-800 dark:border-emerald-700/70 dark:bg-emerald-900/20 dark:text-emerald-200">
                  <p className="font-semibold">Voice sample ready</p>
                  <p className="mt-1">
                    Your {inputMode === 'record' ? 'recording' : 'upload'} is
                    attached. You can now generate speech on the right.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleModeChange(inputMode)}
                    className="mt-3 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-200 dark:hover:bg-emerald-800/40"
                  >
                    Use another sample
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 dark:border-slate-600 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Sample script hint
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {SAMPLE_SCRIPT}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-700/80 dark:bg-slate-900/70 sm:p-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Step 2
              </p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Enter Text and Generate
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Type what you want to hear in your cloned voice.
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/60">
              <textarea
                id="speech-text-input"
                value={textInput}
                onChange={(e) => {
                  const next = e.target.value;
                  if (next.length > planMaxChars) {
                    // Do not mutate the value; keep what's typed so user sees it's longer,
                    // but immediately trigger the upgrade modal and prevent state update.
                    showUpgradeModal('character_limit');
                    return;
                  }
                  setTextInput(next);
                }}
                placeholder={
                  currentStep === 'generate'
                    ? 'Type your message here...'
                    : 'Complete Step 1 to unlock text generation.'
                }
                disabled={currentStep !== 'generate'}
                className="min-h-44 w-full resize-none rounded-lg border-none bg-transparent p-2 text-base text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:text-slate-500"
                maxLength={undefined}
              />

              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleDemoText}
                  disabled={currentStep !== 'generate'}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Demo Text
                </button>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {Math.min(textInput.length, planMaxChars)}/{planMaxChars}{' '}
                  characters
                </p>
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleGenerateSpeech}
              disabled={isGenerating || !canGenerate || isWaitingForFreePlan}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
            >
              {isWaitingForFreePlan ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wait {waitingState.remainingTime}s
                </>
              ) : isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>

            {currentStep !== 'generate' && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Upload or record a voice sample to continue.
              </p>
            )}

            {isWaitingForFreePlan && <FreeUserWaiting />}

            {generatedAudioUrl && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                <audio controls src={generatedAudioUrl} className="w-full">
                  <track
                    kind="captions"
                    src=""
                    srcLang="en"
                    label="English captions"
                  />
                  Your browser does not support the audio element.
                </audio>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Download className="h-4 w-4" />
                    Download Audio
                  </button>

                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
