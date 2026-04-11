'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pause, Play, Volume2 } from 'lucide-react';

export type VoicePickerVoice = {
  avatarImage: string | null;
  displayName: string;
  id: string;
  locale: string;
  locales: string[];
  previewAudio: string | null;
  tags: string[];
  type: string | null;
};

type VoicePickerCardProps = {
  isPreviewing: boolean;
  isSelected: boolean;
  onPreviewToggle: (voice: VoicePickerVoice) => void;
  onSelect: (voice: VoicePickerVoice) => void;
  voice: VoicePickerVoice;
};

export function VoicePickerCard({
  isPreviewing,
  isSelected,
  onPreviewToggle,
  onSelect,
  voice,
}: VoicePickerCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-200',
        isSelected
          ? 'border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950'
          : 'border-slate-200/80 bg-white/88 text-slate-900 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950/65 dark:text-slate-100 dark:hover:border-slate-600'
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(voice)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <Avatar
          className={cn(
            'size-10 border',
            isSelected
              ? 'border-white/20 bg-white/10 dark:border-slate-200/60 dark:bg-slate-100'
              : 'border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900'
          )}
        >
          <AvatarImage
            src={voice.avatarImage || undefined}
            alt={voice.displayName}
          />
          <AvatarFallback
            className={cn(
              'text-[11px] font-semibold',
              isSelected
                ? 'bg-white/10 text-white dark:bg-slate-100 dark:text-slate-950'
                : 'bg-gradient-to-br from-rose-100 via-amber-100 to-sky-100 text-slate-700 dark:from-rose-300/20 dark:via-amber-300/15 dark:to-sky-300/20 dark:text-slate-100'
            )}
          >
            {voice.displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <span className="truncate text-sm font-medium">
          {voice.displayName}
        </span>
      </button>

      <Button
        type="button"
        size="icon"
        variant={isSelected ? 'secondary' : 'ghost'}
        className={cn(
          'size-8 rounded-full',
          isSelected
            ? 'bg-white/12 text-white hover:bg-white/20 dark:bg-slate-900/10 dark:text-slate-950 dark:hover:bg-slate-900/20'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        )}
        onClick={() => onPreviewToggle(voice)}
        disabled={!voice.previewAudio}
      >
        {voice.previewAudio ? (
          isPreviewing ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )
        ) : (
          <Volume2 className="size-4" />
        )}
      </Button>
    </div>
  );
}
