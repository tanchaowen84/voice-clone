'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pause, Play } from 'lucide-react';
import { useState } from 'react';

interface VoiceDemoCardProps {
  id: string;
  name: string;
  description: string;
  avatarGradient: string;
  audioUrl?: string; // 预留音频URL配置
  className?: string;
}

/**
 * Voice Demo Card Component
 * Displays a voice sample with avatar and play button
 */
export function VoiceDemoCard({
  id,
  name,
  description,
  avatarGradient,
  audioUrl,
  className,
}: VoiceDemoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!audioUrl) {
      // 暂时没有音频，显示提示
      console.log(`Playing ${name} voice demo...`);
      return;
    }

    if (isPlaying) {
      // 暂停播放
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      // 开始播放
      if (audio) {
        audio.play();
        setIsPlaying(true);
      } else {
        // 创建新的音频实例
        const newAudio = new Audio(audioUrl);
        newAudio.addEventListener('ended', () => {
          setIsPlaying(false);
        });
        newAudio.addEventListener('error', () => {
          setIsPlaying(false);
          console.error('Audio playback error');
        });
        setAudio(newAudio);
        newAudio.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
      className={cn(
        'bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/50 transition-all duration-200',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Gradient Avatar */}
        <div
          className={cn('w-14 h-14 rounded-full flex-shrink-0', avatarGradient)}
        />

        {/* Voice Info */}
        <div className="flex-1 min-w-0">
          {/* Voice Name */}
          <h3 className="font-medium text-white text-base truncate">{name}</h3>
        </div>

        {/* Play Button */}
        <Button
          size="sm"
          variant="ghost"
          className="w-10 h-10 rounded-full p-0 bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-300 hover:text-white flex-shrink-0"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
