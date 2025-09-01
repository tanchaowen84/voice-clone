'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WaveAudioPlayer } from '@/components/media/wave-audio-player';
import { BlurFade } from '@/components/magicui/blur-fade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAssetUrl } from '@/config/cdn-config';
import { Download, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import { useState } from 'react';

export default function EchoRemoverClient() {
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
    if (f?.type?.startsWith('audio/')) onFilePicked(f);
    else setError('Please drop an audio file');
  }

  async function onRemoveEcho() {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/tools/audio-enhancer', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to remove echo');
      }

      const result = await response.json();
      
      if (result.success && result.data && result.data[0]) {
        setEnhancedUrl(result.data[0].url || result.data[0]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Echo removal failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove echo');
    } finally {
      setIsLoading(false);
    }
  }

  function downloadEnhanced() {
    if (!enhancedUrl) return;
    
    const link = document.createElement('a');
    link.href = enhancedUrl;
    link.download = `echo-removed-${file?.name || 'audio'}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      {/* Hero Section */}
      <BlurFade delay={0.1}>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Echo Remover AI</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Remove echo and reverb from your audio files instantly with AI. 
            Perfect for podcasts, interviews, and voice recordings.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary">AI Powered</Badge>
            <Badge variant="secondary">No Registration</Badge>
            <Badge variant="secondary">Free to Use</Badge>
            <Badge variant="secondary">Instant Results</Badge>
          </div>
        </div>
      </BlurFade>

      {/* Upload Section */}
      <BlurFade delay={0.2}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-5 w-5" />
              Upload Audio File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
            >
              <UploadCloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg mb-2">
                Drag and drop your audio file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports WAV, MP3, FLAC, OGG formats (max 50MB)
              </p>
              <input
                type="file"
                accept="audio/*"
                onChange={onFileChange}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload">
                <Button variant="outline" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
            </div>

            {file && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-medium">Selected file:</p>
                <p className="text-sm text-muted-foreground">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}

            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </BlurFade>

      {/* Process Section */}
      <BlurFade delay={0.3}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Remove Echo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={onRemoveEcho}
              disabled={!file || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing Echo...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Remove Echo with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Results Section */}
      {enhancedUrl && (
        <BlurFade delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Echo Removed Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <WaveAudioPlayer
                  src={enhancedUrl}
                  title="Echo Removed Audio"
                />
                <Button onClick={downloadEnhanced} className="w-full" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Echo-Free Audio
                </Button>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      )}
    </div>
  );
}
