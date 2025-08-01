'use client';

import { useVoiceCloneStore } from '@/stores/voice-clone-store';
import { useEffect, useState } from 'react';
import { VoiceVisualizer, useVoiceVisualizer } from 'react-voice-visualizer';

/**
 * Client-side Voice Recorder Component
 * This component only renders on the client to avoid SSR issues with react-voice-visualizer
 */
export function ClientVoiceRecorder() {
  const { setRecordedBlob } = useVoiceCloneStore();
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

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

      // Cleanup function to revoke the URL
      return () => {
        URL.revokeObjectURL(url);
        setAudioPreviewUrl(null);
      };
    }
    setAudioPreviewUrl(null);
  }, [recordedBlob]);

  return (
    <div className="text-center py-8">
      <div className="space-y-8">
        {/* Voice Visualizer - Neumorphic Design */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff] dark:shadow-[inset_8px_8px_16px_#1e293b,inset_-8px_-8px_16px_#475569]">
          <VoiceVisualizer
            controls={recorderControls}
            height={120}
            width="100%"
            backgroundColor="transparent"
            mainBarColor="#8b5cf6"
            secondaryBarColor="#a78bfa"
            speed={2}
            barWidth={3}
            gap={1}
          />

          {/* Subtle inner glow effect */}
          <div className="absolute inset-4 rounded-xl pointer-events-none opacity-30 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
        </div>

        {/* Recording Time */}
        {isRecordingInProgress && (
          <div className="text-lg font-mono text-muted-foreground">
            Recording: {Math.floor(recordingTime / 60)}:
            {(recordingTime % 60).toString().padStart(2, '0')}
          </div>
        )}

        {/* Recorded Audio Preview */}
        {recordedBlob && (
          <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
              ✅ Recording Complete!
            </h3>
            {audioPreviewUrl && (
              <audio
                controls
                src={audioPreviewUrl}
                className="w-full max-w-md mx-auto"
              >
                <track
                  kind="captions"
                  src=""
                  srcLang="en"
                  label="English captions"
                />
              </audio>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
