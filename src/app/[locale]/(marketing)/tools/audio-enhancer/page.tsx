'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Download,
  Loader2,
  Mic,
  Sparkles,
  UploadCloud,
  Volume2,
  Waves,
} from 'lucide-react';
import { useState } from 'react';

export default function AudioEnhancerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);

  function onFilePicked(f: File | null) {
    setFile(f);
    setError(null);
    setEnhancedUrl(null);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    onFilePicked(e.target.files?.[0] ?? null);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const list = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
    const f = list[0];
    if (f && f.type?.startsWith('audio/')) onFilePicked(f);
    else setError('Please drop an audio file.');
  }

  async function onEnhance() {
    try {
      if (!file) return setError('Please select an audio file first.');
      setIsLoading(true);
      setError(null);
      setEnhancedUrl(null);

      const formData = new FormData();
      formData.append('audio', file);
      const resp = await fetch('/api/tools/audio-enhancer', {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();
      if (!resp.ok) return setError(data?.error || 'Failed to enhance audio.');

      const url = extractAudioUrl(data?.data);
      if (url) setEnhancedUrl(url);
      else setError('Enhanced audio URL not found in response.');
    } catch (e: any) {
      setError(e?.message || 'Unexpected error.');
    } finally {
      setIsLoading(false);
    }
  }

  function extractAudioUrl(data: any): string | null {
    const c: string[] = [];
    const walk = (v: any) => {
      if (!v) return;
      if (typeof v === 'string') c.push(v);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(data);
    for (const s of c) {
      if (s.startsWith('data:audio')) return s;
      if (s.startsWith('http://') || s.startsWith('https://')) return s;
    }
    return null;
  }

  function onDownloadEnhanced() {
    if (!enhancedUrl) return;
    const a = document.createElement('a');
    a.href = enhancedUrl;
    a.download = 'enhanced-audio';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Online Audio Enhancer
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Free Audio Enhancer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Remove noise and improve clarity. No account required.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary">
            <Waves className="h-3.5 w-3.5" /> Noise remover
          </Badge>
          <Badge variant="secondary">
            <Volume2 className="h-3.5 w-3.5" /> Loudness fix
          </Badge>
          <Badge variant="secondary">
            <Mic className="h-3.5 w-3.5" /> Hum reduction
          </Badge>
        </div>
      </div>

      {/* Upload Panel */}
      {!isLoading && !enhancedUrl && (
        <div
          className={`relative rounded-xl border border-dashed p-8 text-center transition-colors ${isDragOver ? 'bg-accent/40' : 'bg-background'}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
        >
          <input
            id="file"
            type="file"
            accept="audio/*"
            onChange={onFileChange}
            className="hidden"
          />
          <UploadCloud className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          {!file ? (
            <>
              <p className="text-sm">Choose a file or drag it here</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supported formats: .mp3, .wav, .flac
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <label htmlFor="file">
                  <Button asChild>
                    <span>Select Audio</span>
                  </Button>
                </label>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">Selected: {file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You can change the file or click Enhance below.
              </p>
            </>
          )}
          {error && (
            <div className="mt-3">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Enhancing */}
      {file && isLoading && (
        <div className="rounded-xl border p-8 text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin" />
          <p className="text-sm">Enhancing your audio...</p>
        </div>
      )}

      {/* Step 3: Result */}
      {enhancedUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Enhanced</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={onDownloadEnhanced}
              disabled={!enhancedUrl}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
          <div className="rounded-md border p-3">
            <audio controls className="w-full" src={enhancedUrl}>
              <track
                kind="captions"
                src=""
                srcLang="en"
                label="English captions"
              />
            </audio>
          </div>
        </div>
      )}

      {/* Global Action Bar */}
      {!isLoading && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <label htmlFor="file">
            <Button variant="outline">Change</Button>
          </label>
          <Button onClick={onEnhance} disabled={!file}>
            <span className="inline-flex items-center gap-2">
              Enhance <UploadCloud className="h-4 w-4" />
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
