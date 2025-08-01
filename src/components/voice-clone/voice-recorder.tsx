'use client';

import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the client-side recorder to avoid SSR issues
const ClientVoiceRecorder = dynamic(
  () =>
    import('./client-voice-recorder').then((mod) => ({
      default: mod.ClientVoiceRecorder,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8">
        <div className="space-y-6">
          <div className="bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-xl p-8">
            <div className="flex items-center justify-center h-[120px]">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading voice recorder...</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Initializing microphone access and audio visualization...
          </div>
        </div>
      </div>
    ),
  }
);

/**
 * Voice Recorder Component
 * Handles recording functionality with voice visualization
 * Uses dynamic import to avoid SSR issues with react-voice-visualizer
 */
export function VoiceRecorder() {
  return <ClientVoiceRecorder />;
}
