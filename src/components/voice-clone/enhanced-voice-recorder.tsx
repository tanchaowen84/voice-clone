'use client';

import { cn } from '@/lib/utils';
import { useVoiceCloneStore } from '@/stores/voice-clone-store';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { VoiceVisualizer, useVoiceVisualizer } from 'react-voice-visualizer';
import { PremiumMicButton } from './premium-mic-button';

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
            {/* Enhanced Wave Background for Better Contrast */}
            <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-white/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/50" />
            {/* Siri Wave Animation */}
            <div className="h-32 flex items-center justify-center relative">
              {/* Primary Wave */}
              <div className="absolute inset-0 flex items-center justify-center">
                <SiriWave
                  theme="ios9"
                  color="#8b5cf6"
                  amplitude={isRecordingInProgress ? 4 : 1.5}
                  speed={isRecordingInProgress ? 0.2 : 0.05}
                  frequency={isRecordingInProgress ? 8 : 4}
                  width={400}
                  height={120}
                  autostart={true}
                  pixelDepth={0.005}
                  lerpSpeed={0.05}
                />
              </div>

              {/* Secondary Wave for Enhanced Effect */}
              <div className="absolute inset-0 flex items-center justify-center opacity-60">
                <SiriWave
                  theme="ios9"
                  color="#a78bfa"
                  amplitude={isRecordingInProgress ? 2.5 : 1}
                  speed={isRecordingInProgress ? 0.15 : 0.03}
                  frequency={isRecordingInProgress ? 6 : 3}
                  width={400}
                  height={120}
                  autostart={true}
                  pixelDepth={0.008}
                  lerpSpeed={0.03}
                />
              </div>

              {/* Enhanced Central Microphone Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <PremiumMicButton
                  isRecording={isRecordingInProgress}
                  onStartRecording={recorderControls.startRecording}
                  onStopRecording={recorderControls.stopRecording}
                />
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
                {Math.floor(recordingTime % 60)
                  .toString()
                  .padStart(2, '0')}
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
