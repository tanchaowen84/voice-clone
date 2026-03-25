'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Pause, Play, Volume2 } from 'lucide-react';

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
        'w-full rounded-[20px] border p-3 text-left transition-all duration-200',
        isSelected
          ? 'border-slate-900 bg-slate-950 text-white shadow-lg shadow-slate-300/35 dark:border-white dark:bg-white dark:text-slate-950 dark:shadow-slate-950/20'
          : 'border-slate-200/80 bg-white/85 text-slate-900 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-950'
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onSelect(voice)}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <Avatar
            className={cn(
              'mt-0.5 size-11 border shadow-sm',
              isSelected
                ? 'border-white/25 bg-white/10 dark:border-slate-200/60 dark:bg-slate-100'
                : 'border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900'
            )}
          >
            <AvatarImage
              src={voice.avatarImage || undefined}
              alt={voice.displayName}
            />
            <AvatarFallback
              className={cn(
                'text-xs font-semibold',
                isSelected
                  ? 'bg-white/10 text-white dark:bg-slate-100 dark:text-slate-950'
                  : 'bg-gradient-to-br from-rose-100 via-amber-100 to-sky-100 text-slate-700 dark:from-rose-300/20 dark:via-amber-300/15 dark:to-sky-300/20 dark:text-slate-100'
              )}
            >
              {voice.displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">
                  {voice.displayName}
                </p>
                {isSelected && <Check className="size-3.5 shrink-0" />}
              </div>
              <p
                className={cn(
                  'mt-1 text-xs',
                  isSelected
                    ? 'text-white/70 dark:text-slate-600'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                {voice.id}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {voice.tags.map((tag) => (
                <Badge
                  key={`${voice.id}-${tag}`}
                  variant="outline"
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11px]',
                    isSelected
                      ? 'border-white/15 bg-white/8 text-white dark:border-slate-900/10 dark:bg-slate-900/10 dark:text-slate-800'
                      : 'border-slate-200/80 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300'
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </button>

        <Button
          type="button"
          size="icon"
          variant={isSelected ? 'secondary' : 'ghost'}
          className={cn(
            'size-9 rounded-full',
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
    </div>
  );
}
