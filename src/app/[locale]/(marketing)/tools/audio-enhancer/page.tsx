'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Download, Loader2, UploadCloud } from 'lucide-react';
import { useState } from 'react';

export default function AudioEnhancerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
    setEnhancedUrl(null);
    setRawResponse(null);
    if (f) setOriginalUrl(URL.createObjectURL(f));
  }

  async function onEnhance() {
    try {
      setIsLoading(true);
      setError(null);
      setEnhancedUrl(null);
      setRawResponse(null);

      if (!file) {
        setError('Please select an audio file first.');
        return;
      }

      const formData = new FormData();
      formData.append('audio', file);

      const resp = await fetch('/api/tools/audio-enhancer', {
        method: 'POST',
        body: formData,
      });

      const data = await resp.json();
      setRawResponse(data);

      if (!resp.ok) {
        setError(data?.error || 'Failed to enhance audio.');
        return;
      }

      const url = extractAudioUrl(data?.data);
      if (url) {
        setEnhancedUrl(url);
      } else {
        // Fallback: keep JSON visible for manual inspection
        setError(
          'Enhanced audio URL not found in response. See raw output below.'
        );
      }
    } catch (e: any) {
      setError(e?.message || 'Unexpected error.');
    } finally {
      setIsLoading(false);
    }
  }

  function extractAudioUrl(data: any): string | null {
    // Try common patterns in Gradio output
    const candidates: string[] = [];

    function collect(val: any) {
      if (!val) return;
      if (typeof val === 'string') {
        candidates.push(val);
      } else if (Array.isArray(val)) {
        val.forEach(collect);
      } else if (typeof val === 'object') {
        for (const k of Object.keys(val)) {
          collect(val[k]);
        }
      }
    }

    collect(data);

    // Prefer data URLs or http(s) links that look like audio
    for (const c of candidates) {
      if (typeof c !== 'string') continue;
      if (c.startsWith('data:audio')) return c;
      if (c.startsWith('http://') || c.startsWith('https://')) return c;
    }
    return null;
  }

  function onDownloadEnhanced() {
    if (!enhancedUrl) return;
    const a = document.createElement('a');
    a.href = enhancedUrl;
    a.download = 'enhanced-audio'; // extension may be inferred by browser
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Audio Enhancer</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload & Enhance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="audio">Audio File</Label>
            <div className="flex items-center gap-3">
              <Input
                id="audio"
                type="file"
                accept="audio/*"
                onChange={onFileChange}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={onEnhance}
                disabled={!file || isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Enhancing
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <UploadCloud className="h-4 w-4" /> Enhance
                  </span>
                )}
              </Button>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h2 className="text-sm font-medium">Original</h2>
              <div className="rounded-md border p-3">
                {originalUrl ? (
                  <audio controls className="w-full" src={originalUrl}>
                    <track
                      kind="captions"
                      src=""
                      srcLang="en"
                      label="English captions"
                    />
                  </audio>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No file selected
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Enhanced</h2>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onDownloadEnhanced}
                  disabled={!enhancedUrl}
                >
                  <span className="inline-flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download
                  </span>
                </Button>
              </div>
              <div className="rounded-md border p-3">
                {enhancedUrl ? (
                  <audio controls className="w-full" src={enhancedUrl}>
                    <track
                      kind="captions"
                      src=""
                      srcLang="en"
                      label="English captions"
                    />
                  </audio>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No result yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h2 className="text-sm font-medium">Raw Response (debug)</h2>
            <pre className="text-xs rounded-md border p-3 overflow-auto max-h-80 bg-muted">
              {rawResponse
                ? JSON.stringify(rawResponse, null, 2)
                : 'No response yet'}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
