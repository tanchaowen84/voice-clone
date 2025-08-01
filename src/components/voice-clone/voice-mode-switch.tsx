'use client';

import { Button } from '@/components/ui/button';
import { useVoiceCloneStore } from '@/stores/voice-clone-store';
import { Mic, Upload } from 'lucide-react';

/**
 * Voice Mode Switch Component
 * Allows users to switch between Record and Upload modes
 */
export function VoiceModeSwitch() {
  const { inputMode, setInputMode } = useVoiceCloneStore();

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="inline-flex items-center bg-muted/50 backdrop-blur-sm border-2 rounded-xl p-1">
        <Button
          variant={inputMode === 'record' ? 'default' : 'ghost'}
          size="lg"
          onClick={() => setInputMode('record')}
          className={`
            flex items-center gap-3 text-base font-medium h-12 px-6 rounded-lg transition-all duration-200
            ${
              inputMode === 'record'
                ? 'bg-background shadow-lg text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <Mic className="h-5 w-5" />
          Record
        </Button>

        <Button
          variant={inputMode === 'upload' ? 'default' : 'ghost'}
          size="lg"
          onClick={() => setInputMode('upload')}
          className={`
            flex items-center gap-3 text-base font-medium h-12 px-6 rounded-lg transition-all duration-200
            ${
              inputMode === 'upload'
                ? 'bg-background shadow-lg text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <Upload className="h-5 w-5" />
          Upload
        </Button>
      </div>
    </div>
  );
}
