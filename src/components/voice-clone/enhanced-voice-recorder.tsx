'use client';

import { cn } from '@/lib/utils';
import { useVoiceCloneStore } from '@/stores/voice-clone-store';
import { motion } from 'framer-motion';
import { Mic, Pause, Play, Square } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { VoiceVisualizer, useVoiceVisualizer } from 'react-voice-visualizer';

// Dynamically import SiriWave to avoid SSR issues
const SiriWave = dynamic(() => import('react-siriwave'), { ssr: false });

/**
 * Enhanced Voice Recorder Component with Siri-style waveform
 * Features dynamic wave animations and neumorphic design
 */
export function EnhancedVoiceRecorder() {
  const { setRecordedBlob } = useVoiceCloneStore();
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Voice recording setup
  const recorderControls = useVoiceVisualizer();
  const { recordedBlob, recordingTime, isRecordingInProgress } =
    recorderControls;

  // Update store when recording is complete
  useEffect(() => {
    if (recordedBlob) {
      setRecordedBlob(recordedBlob);
    }
  }, [recordedBlob, setRecordedBlob]);

  // Create audio preview URL safely
  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      setAudioPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
        setAudioPreviewUrl(null);
      };
    }
    setAudioPreviewUrl(null);
  }, [recordedBlob]);

  const handlePlayPause = () => {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="text-center py-8">
      <div className="space-y-8">
        {/* Main Recording Interface */}
        <div className="relative">
          {/* Siri Wave Background */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff] dark:shadow-[inset_8px_8px_16px_#1e293b,inset_-8px_-8px_16px_#475569] overflow-hidden">
            {/* Siri Wave Animation */}
            <div className="h-32 flex items-center justify-center relative">
              <SiriWave
                theme="ios9"
                color="#8b5cf6"
                amplitude={isRecordingInProgress ? 2 : 0.5}
                speed={isRecordingInProgress ? 0.3 : 0.1}
                frequency={isRecordingInProgress ? 6 : 2}
                width={400}
                height={120}
                autostart={true}
                pixelDepth={0.02}
                lerpSpeed={0.01}
              />

              {/* Central Microphone Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  onClick={
                    isRecordingInProgress
                      ? recorderControls.stopRecording
                      : recorderControls.startRecording
                  }
                  className={cn(
                    'relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
                    'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800',
                    'shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#1e293b,-6px_-6px_12px_#475569]',
                    'hover:shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff] dark:hover:shadow-[4px_4px_8px_#1e293b,-4px_-4px_8px_#475569]',
                    'active:shadow-[inset_3px_3px_6px_#d1d5db,inset_-3px_-3px_6px_#ffffff] dark:active:shadow-[inset_3px_3px_6px_#1e293b,inset_-3px_-3px_6px_#475569]'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: isRecordingInProgress ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: isRecordingInProgress
                      ? Number.POSITIVE_INFINITY
                      : 0,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Pulsing Ring for Recording */}
                  {isRecordingInProgress && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-red-400"
                      animate={{
                        scale: [1, 1.8, 2.2],
                        opacity: [0.8, 0.3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeOut',
                      }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    animate={{
                      rotate: isRecordingInProgress ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: isRecordingInProgress
                        ? Number.POSITIVE_INFINITY
                        : 0,
                      ease: 'easeInOut',
                    }}
                  >
                    {isRecordingInProgress ? (
                      <Square className="w-5 h-5 fill-current text-red-500 dark:text-red-400" />
                    ) : (
                      <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Subtle gradient overlay */}
            <div className="absolute inset-4 rounded-2xl pointer-events-none opacity-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          </div>

          {/* Recording Status */}
          {isRecordingInProgress && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-2"
            >
              <motion.div
                className="w-3 h-3 bg-red-500 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-lg font-mono text-slate-600 dark:text-slate-400">
                {Math.floor(recordingTime / 60)}:
                {(recordingTime % 60).toString().padStart(2, '0')}
              </span>
            </motion.div>
          )}
        </div>

        {/* Recorded Audio Preview */}
        {recordedBlob && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#1e293b,-8px_-8px_16px_#475569]"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Recording Complete
              </h3>
            </div>

            {audioPreviewUrl && (
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#1e293b,-4px_-4px_8px_#475569] hover:shadow-[2px_2px_4px_#d1d5db,-2px_-2px_4px_#ffffff] dark:hover:shadow-[2px_2px_4px_#1e293b,-2px_-2px_4px_#475569] active:shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] dark:active:shadow-[inset_2px_2px_4px_#1e293b,inset_-2px_-2px_4px_#475569] flex items-center justify-center transition-all duration-200"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  ) : (
                    <Play className="w-5 h-5 text-slate-600 dark:text-slate-300 ml-0.5" />
                  )}
                </button>

                <audio
                  src={audioPreviewUrl}
                  className="hidden"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  <track
                    kind="captions"
                    src=""
                    srcLang="en"
                    label="English captions"
                  />
                </audio>

                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Click to preview your recording
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
