'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { WaveAudioPlayer } from '@/components/media/wave-audio-player';

import { BlurFade } from '@/components/magicui/blur-fade';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import seoContent from '@/content/tools/audio-enhancer.en.json';

import { Download, Loader2, Sparkles, UploadCloud } from 'lucide-react';
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
    if (f?.type?.startsWith('audio/')) onFilePicked(f);
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

  function resetFlow() {
    setFile(null);
    setEnhancedUrl(null);
    setError(null);
    setIsDragOver(false);
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <BlurFade>
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> {seoContent.hero.title}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {seoContent.hero.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {seoContent.hero.subtitle}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {seoContent.hero.bullets.map((b, i) => (
              <Badge key={b + i} variant="secondary">
                {b}
              </Badge>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button asChild>
              <a href={seoContent.cta.href}>{seoContent.cta.label}</a>
            </Button>
          </div>
        </div>
      </BlurFade>

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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Enhanced</h3>
            <Button size="sm" variant="outline" onClick={onDownloadEnhanced}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>

          <div className="rounded-md">
            <WaveAudioPlayer src={enhancedUrl!} />
          </div>

          {/* Call-to-action: use again */}
          <div className="pt-2 border-t flex items-center justify-center">
            <Button onClick={resetFlow}>Enhance another audio</Button>
          </div>
        </div>
      )}

      {/* Global Action Bar */}
      {!isLoading && !enhancedUrl && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={resetFlow}>
            Clear
          </Button>
          <Button onClick={onEnhance} disabled={!file}>
            <span className="inline-flex items-center gap-2">
              Enhance <UploadCloud className="h-4 w-4" />
            </span>
          </Button>
        </div>
      )}

      {/* SEO Content: Structured Sections (JSON-driven) */}
      <section className="mt-16 space-y-12">
        {/* Problems */}
        <BlurFade>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {seoContent.problems.title}
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl">
              {seoContent.problems.intro}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {seoContent.problems.items.map((it, i) => (
              <BlurFade key={it.title + i} delay={i * 0.06}>
                <Card>
                  <CardHeader>
                    <CardTitle>{it.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{it.body}</p>
                  </CardContent>
                </Card>
              </BlurFade>
            ))}
          </div>
        </BlurFade>

        {/* How it works */}
        <BlurFade>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {seoContent.howItWorks.title}
            </h2>
            <div className="space-y-1 text-sm text-muted-foreground max-w-3xl">
              {seoContent.howItWorks.paragraphs.map((p, i) => (
                <BlurFade key={i} delay={i * 0.05}>
                  <p>{p}</p>
                </BlurFade>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Audience */}
        <BlurFade>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {seoContent.audience.title}
            </h2>
            <ul className="grid grid-cols-1 gap-1 pl-5 text-sm text-muted-foreground md:grid-cols-2 list-disc">
              {seoContent.audience.items.map((t, i) => (
                <li key={t + i}>{t}</li>
              ))}
            </ul>
          </div>
        </BlurFade>

        {/* Steps timeline */}
        <BlurFade>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{seoContent.steps.title}</h2>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {seoContent.steps.items.map((t, i) => (
                <li key={t + i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground">
              {seoContent.steps.tip}
            </p>
          </div>
        </BlurFade>

        {/* Best practices */}
        <BlurFade>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {seoContent.bestPractices.title}
            </h2>
            <ul className="space-y-1 pl-5 text-sm text-muted-foreground list-disc">
              {seoContent.bestPractices.items.map((t, i) => (
                <li key={t + i}>{t}</li>
              ))}
            </ul>
          </div>
        </BlurFade>

        {/* Compatibility */}
        <BlurFade>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {seoContent.compatibility.title}
            </h2>
            <ul className="space-y-1 pl-5 text-sm text-muted-foreground list-disc">
              {seoContent.compatibility.items.map((t, i) => (
                <li key={t + i}>{t}</li>
              ))}
            </ul>
          </div>
        </BlurFade>

        {/* Privacy */}
        <BlurFade>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {seoContent.privacy.title}
            </h2>
            <ul className="space-y-1 pl-5 text-sm text-muted-foreground list-disc">
              {seoContent.privacy.items.map((t, i) => (
                <li key={t + i}>{t}</li>
              ))}
            </ul>
          </div>
        </BlurFade>

        {/* FAQ */}
        <BlurFade>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{seoContent.faq.title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {seoContent.faq.items.map((f, i) => (
                <AccordionItem key={f.q + i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </BlurFade>

        {/* Bottom CTA */}
        <div className="pt-2">
          <a
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
            href={seoContent.cta.href}
          >
            {seoContent.cta.label}
          </a>
        </div>
      </section>
    </div>
  );
}
