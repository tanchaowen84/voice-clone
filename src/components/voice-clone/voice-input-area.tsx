'use client';

import { FreeUserWaiting } from '@/components/subscription/free-user-waiting';
import { getPlanConfig } from '@/config/subscription-config';
import { useSubscriptionStore } from '@/stores/subscription-store';
import { useVoiceCloneStore } from '@/stores/voice-clone-store';
import { Download, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EnhancedVoiceRecorder } from './enhanced-voice-recorder';
import { FileUploader } from './file-uploader';

/**
 * Voice Input Area Component
 * Dynamically renders content based on inputMode and currentStep
 */
export function VoiceInputArea() {
  const {
    inputMode,
    currentStep,
    isGenerating,
    generatedAudioUrl,
    error,
    generateSpeech,
    reset,
  } = useVoiceCloneStore();

  const { subscription, waitingState, fetchAllData, showUpgradeModal } =
    useSubscriptionStore();
  const [textInput, setTextInput] = useState('');

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

  const handleGenerateSpeech = async () => {
    if (!textInput.trim()) return;
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

  // Show text input interface when audio is ready
  if (currentStep === 'generate') {
    return (
      <div className="space-y-8">
        {/* Single Neumorphic Input Container with Embedded Elements */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] dark:shadow-[inset_6px_6px_12px_#1e293b,inset_-6px_-6px_12px_#475569]">
          {/* Subtle gradient overlay for purple tint */}
          <div className="absolute inset-4 rounded-2xl pointer-events-none opacity-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />

          <textarea
            id="speech-text-input"
            value={textInput}
            onChange={(e) => {
              const next = e.target.value;
              if (next.length > planMaxChars) {
                // Do not mutate the value; keep what's typed so user sees it's longer,
                // but immediately trigger the upgrade modal and prevent state update.
                // This avoids silent truncation and guides user to upgrade.
                showUpgradeModal('character_limit');
                return;
              }
              setTextInput(next);
            }}
            placeholder="Type your message here..."
            className="w-full min-h-40 p-4 pr-44 pb-12 text-lg bg-transparent border-none outline-none resize-none placeholder:text-slate-400/60 dark:placeholder:text-slate-500/60 text-slate-700 dark:text-slate-300 rounded-2xl"
            // Remove hard cap to avoid browser truncating; enforce via handler above
            maxLength={undefined}
          />

          {/* Embedded Demo Text Button */}
          <button
            type="button"
            onClick={handleDemoText}
            className="absolute left-3 bottom-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600 text-slate-700 dark:text-slate-200 shadow-[3px_3px_6px_#d1d5db,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#1e293b,-3px_-3px_6px_#475569] hover:shadow-[2px_2px_4px_#d1d5db,-2px_-2px_4px_#ffffff] dark:hover:shadow-[2px_2px_4px_#1e293b,-2px_-2px_4px_#475569] active:shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] dark:active:shadow-[inset_2px_2px_4px_#1e293b,inset_-2px_-2px_4px_#475569]"
          >
            Demo Text
          </button>

          {/* Embedded Character Count */}
          <div className="absolute right-3 top-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {Math.min(textInput.length, planMaxChars)}/{planMaxChars} characters
          </div>

          {/* Embedded Neumorphic Generate Button */}
          <button
            type="button"
            onClick={handleGenerateSpeech}
            disabled={
              isGenerating || !textInput.trim() || waitingState.isWaiting
            }
            className={`
              absolute right-3 bottom-3 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
              ${
                isGenerating || !textInput.trim() || waitingState.isWaiting
                  ? 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#1e293b,inset_-2px_-2px_4px_#475569]'
                  : 'bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600 text-slate-700 dark:text-slate-200 shadow-[3px_3px_6px_#d1d5db,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#1e293b,-3px_-3px_6px_#475569] hover:shadow-[2px_2px_4px_#d1d5db,-2px_-2px_4px_#ffffff] dark:hover:shadow-[2px_2px_4px_#1e293b,-2px_-2px_4px_#475569] active:shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] dark:active:shadow-[inset_2px_2px_4px_#1e293b,inset_-2px_-2px_4px_#475569]'
              }
            `}
          >
            {waitingState.isWaiting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">
                  Wait {waitingState.remainingTime}s
                </span>
              </div>
            ) : isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
              </div>
            ) : (
              'Generate'
            )}
          </button>

          {/* Error Display - Only show when there's an error */}
          {error && (
            <div className="absolute left-3 top-3 text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Free User Waiting Component */}
        {waitingState.isWaiting && <FreeUserWaiting />}

        {/* Success Result - Single Neumorphic Container */}
        {generatedAudioUrl && (
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] dark:shadow-[inset_6px_6px_12px_#1e293b,inset_-6px_-6px_12px_#475569]">
            {/* Subtle gradient overlay for purple tint */}
            <div className="absolute inset-4 rounded-2xl pointer-events-none opacity-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />

            {/* Audio Player */}
            <div className="mb-6 relative z-10">
              <audio
                controls
                src={generatedAudioUrl}
                className="w-full max-w-md mx-auto [&::-webkit-media-controls-panel]:bg-transparent [&::-webkit-media-controls-play-button]:opacity-80 [&::-webkit-media-controls-timeline]:opacity-80"
              >
                <track
                  kind="captions"
                  src=""
                  srcLang="en"
                  label="English captions"
                />
                Your browser does not support the audio element.
              </audio>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center relative z-10">
              {/* Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600 text-slate-700 dark:text-slate-200 shadow-[3px_3px_6px_#d1d5db,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#1e293b,-3px_-3px_6px_#475569] hover:shadow-[2px_2px_4px_#d1d5db,-2px_-2px_4px_#ffffff] dark:hover:shadow-[2px_2px_4px_#1e293b,-2px_-2px_4px_#475569] active:shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] dark:active:shadow-[inset_2px_2px_4px_#1e293b,inset_-2px_-2px_4px_#475569] transition-all duration-200"
              >
                <Download className="h-4 w-4" />
                Download Audio
              </button>

              {/* Start Over Button */}
              <button
                type="button"
                onClick={handleStartOver}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-500 dark:to-slate-600 text-slate-700 dark:text-slate-200 shadow-[3px_3px_6px_#d1d5db,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_#1e293b,-3px_-3px_6px_#475569] hover:shadow-[2px_2px_4px_#d1d5db,-2px_-2px_4px_#ffffff] dark:hover:shadow-[2px_2px_4px_#1e293b,-2px_-2px_4px_#475569] active:shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] dark:active:shadow-[inset_2px_2px_4px_#1e293b,inset_-2px_-2px_4px_#475569] transition-all duration-200"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show input interface based on mode
  if (currentStep === 'input') {
    return (
      <div className="space-y-6">
        {inputMode === 'record' ? (
          // Enhanced Recording Interface with Siri Wave
          <EnhancedVoiceRecorder />
        ) : (
          // Upload Interface
          <FileUploader />
        )}

        {/* Sample text guidance - only show in record mode */}
        {inputMode === 'record' && (
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-foreground mb-3">
              Read this sample text aloud:
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              "Hello everyone! I'm trying out Voice Clone technology to create
              my own voice model. It's really convenient and I'm excited to see
              how it works!"
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
