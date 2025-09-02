'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface WaveAudioPlayerProps {
  src: string;
  className?: string;
  height?: number;
  title?: string;
}

export function WaveAudioPlayer({
  src,
  className,
  height = 72,
  title,
}: WaveAudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const WaveSurfer = (await import('wavesurfer.js')).default as any;
        if (disposed || !containerRef.current) return;
        const ws = WaveSurfer.create({
          container: containerRef.current,
          height,
          waveColor: '#cbd5e1', // slate-300
          progressColor: '#7c3aed', // violet-600
          cursorColor: '#94a3b8', // slate-400
          barWidth: 2,
          barGap: 2,
          normalize: true,
        });
        waveRef.current = ws;
        ws.load(src);
        ws.on('ready', () => {
          if (disposed) return;
          setIsReady(true);
          setDuration(ws.getDuration() || 0);
        });
        ws.on('audioprocess', () => {
          if (disposed) return;
          setCurrent(ws.getCurrentTime() || 0);
        });
        ws.on('seek', () => {
          if (disposed) return;
          setCurrent(ws.getCurrentTime() || 0);
        });
        ws.on('finish', () => setIsPlaying(false));
      } catch (err) {
        console.error('wavesurfer init failed', err);
        setFailed(true);
      }
    })();
    return () => {
      disposed = true;
      try {
        waveRef.current?.destroy?.();
      } catch {}
      waveRef.current = null;
    };
  }, [src, height]);

  const togglePlay = () => {
    const ws = waveRef.current;
    if (!ws || !isReady) return;
    ws.playPause();
    setIsPlaying(ws.isPlaying());
  };

  const fmt = (t: number) => {
    if (!Number.isFinite(t)) return '0:00';
    const m = Math.floor(t / 60)
      .toString()
      .padStart(1, '0');
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  if (failed) {
    // Fallback to native audio if library not available
    return (
      <div className={cn('rounded-md border p-3', className)} aria-label={title}>
        <audio controls className="w-full" src={src} title={title}>
          <track kind="captions" src="" srcLang="en" label="English captions" />
        </audio>
      </div>
    );
  }

  return (
    <div className={cn('rounded-md border p-3', className)} aria-label={title}>
      <div ref={containerRef} className="w-full" />
      <div className="mt-3 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={togglePlay}
          disabled={!isReady}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <div className="text-xs text-muted-foreground">
          {fmt(current)} / {fmt(duration)}
        </div>
      </div>
    </div>
  );
}
