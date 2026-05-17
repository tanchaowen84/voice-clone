'use client';

import { BlurFade } from '@/components/magicui/blur-fade';
import { WaveAudioPlayer } from '@/components/media/wave-audio-player';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { Download, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import { useState } from 'react';

const echoProblems = [
  {
    title: 'Room Echo in Voice Recordings',
    body: 'Reduce the hollow sound caused by hard walls, empty rooms, and desk reflections so speech feels closer and easier to understand.',
  },
  {
    title: 'Podcast and Interview Reverb',
    body: 'Clean up guest audio, remote interviews, and home podcast takes when the voice is clear but the room adds a distracting tail.',
  },
  {
    title: 'Video and Webinar Audio',
    body: 'Use it after extracting audio from a video, screen recording, online class, or webinar where echo makes spoken content tiring.',
  },
  {
    title: 'Voiceover Cleanup',
    body: 'Improve narration, course audio, and creator voiceovers before publishing, editing, or sending the track to a client.',
  },
];

const echoSteps = [
  {
    title: 'Upload Your Audio',
    body: 'Choose an MP3, WAV, FLAC, or OGG file up to 50MB. Short speech clips usually preview faster.',
  },
  {
    title: 'Remove Echo with AI',
    body: 'The tool focuses on room echo and reverb while trying to keep the original voice natural.',
  },
  {
    title: 'Preview and Download',
    body: 'Listen to the processed result, then download the echo-reduced audio for your editor or publishing workflow.',
  },
];

const faqItems = [
  {
    q: 'Is this a free echo remover AI?',
    a: 'Yes. You can upload a supported audio file and reduce moderate room echo or reverb online without creating an account.',
  },
  {
    q: 'Can it remove echo from podcast or video audio?',
    a: 'Yes. It is built for speech-heavy recordings like podcasts, interviews, voiceovers, webinars, and extracted video audio where the main voice is still clear.',
  },
  {
    q: 'What file formats are supported?',
    a: 'The uploader accepts common audio formats including MP3, WAV, FLAC, and OGG, with a maximum file size of 50MB.',
  },
  {
    q: 'Is this also a reverb remover?',
    a: 'It can reduce room reverb and echo tails in many voice recordings, but very heavy reverb, distortion, or clipping may still need re-recording or manual editing.',
  },
  {
    q: 'Will it remove background noise too?',
    a: 'This page focuses on echo and room reverb. For hiss, hum, fan noise, or broader speech cleanup, try the audio enhancer as a separate pass.',
  },
];

export default function EchoRemoverClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);

  function onFilePicked(f: File | null) {
    if (!f) {
      setFile(null);
      setError(null);
      setEnhancedUrl(null);
      return;
    }

    // Validate file type
    if (!f.type.startsWith('audio/')) {
      setError('Please select an audio file (WAV, MP3, FLAC, OGG)');
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (f.size > maxSize) {
      setError('File size must be less than 50MB');
      return;
    }

    setFile(f);
    setError(null);
    setEnhancedUrl(null);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    onFilePicked(selectedFile);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const list = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
    const f = list[0];
    if (f) {
      onFilePicked(f);
    } else {
      setError('No file was dropped');
    }
  }

  function extractAudioUrl(data: any): string | null {
    const candidates: string[] = [];
    const walk = (v: any) => {
      if (!v) return;
      if (
        typeof v === 'string' &&
        (v.startsWith('http') || v.startsWith('blob:'))
      ) {
        candidates.push(v);
      } else if (Array.isArray(v)) {
        v.forEach(walk);
      } else if (typeof v === 'object') {
        Object.values(v).forEach(walk);
      }
    };
    walk(data);
    return (
      candidates.find(
        (url) =>
          url.includes('.wav') || url.includes('.mp3') || url.includes('audio')
      ) ||
      candidates[0] ||
      null
    );
  }

  async function onRemoveEcho() {
    try {
      if (!file) return setError('Please select an audio file first');
      setIsLoading(true);
      setError(null);
      setEnhancedUrl(null);

      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/tools/audio-enhancer', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return setError(data?.error || 'Failed to remove echo');
      }

      const url = extractAudioUrl(data?.data);
      if (url) {
        setEnhancedUrl(url);
      } else {
        setError('No audio URL found in response');
      }
    } catch (err: any) {
      console.error('Echo removal failed:', err);
      setError(err?.message || 'Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  function downloadEnhanced() {
    if (!enhancedUrl) return;

    const link = document.createElement('a');
    link.href = enhancedUrl;
    link.download = `echo-reduced-${file?.name || 'audio'}.wav`;
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
            <h1 className="text-4xl font-bold">Echo Remover AI for Audio</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Remove echo from audio online and reduce room reverb in podcasts,
            interviews, videos, and voice recordings. Upload a file, process it
            with AI, then download the cleaner track.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary">Echo Remover from Audio</Badge>
            <Badge variant="secondary">Reverb Reduction</Badge>
            <Badge variant="secondary">No Registration</Badge>
            <Badge variant="secondary">MP3/WAV/FLAC/OGG</Badge>
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
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
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
                onClick={() => document.getElementById('audio-upload')?.click()}
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
                <Button variant="outline" className="pointer-events-none">
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Selected file:</p>
                    <p className="text-sm text-muted-foreground">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setError(null);
                      setEnhancedUrl(null);
                      // Reset the file input
                      const input = document.getElementById(
                        'audio-upload'
                      ) as HTMLInputElement;
                      if (input) input.value = '';
                    }}
                  >
                    Change File
                  </Button>
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={onFileChange}
                  className="hidden"
                  id="audio-upload"
                />
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
                Echo Reduced Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <WaveAudioPlayer src={enhancedUrl} title="Processed Audio" />
                <Button onClick={downloadEnhanced} className="w-full" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Processed Audio
                </Button>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      )}

      {/* Content Section */}
      <BlurFade delay={0.5}>
        <div className="mt-16 space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6">
              Remove Echo from Audio Online
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                This echo remover AI is built for people who need a quick way to
                reduce room echo, reverb, and hollow-sounding voice recordings
                before publishing. It works directly in the browser: upload your
                audio, run the AI cleanup, then download the processed file.
              </p>
              <p>
                The tool is best for speech-first content such as podcasts,
                interviews, voiceovers, webinars, lectures, and video audio
                where the speaker is audible but the room sound is distracting.
                It is not a replacement for full audio mastering, and it will
                not fully repair clipped, distorted, or extremely noisy source
                files.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">
              Echo and Reverb Problems It Can Help With
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {echoProblems.map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">
              How to Remove Echo from Audio
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {echoSteps.map((step, index) => (
                <Card key={step.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">
                        {index + 1}
                      </span>
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">
              Echo Remover vs Audio Enhancer
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Use this page when your main problem is echo or reverb from the
                room. If the recording also has hiss, hum, fan noise, mouth
                clicks, or general background noise, try the{' '}
                <LocaleLink
                  href={Routes.ToolsAudioEnhancer}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  audio enhancer
                </LocaleLink>{' '}
                as a separate cleanup pass.
              </p>
              <p>
                For new recordings, start with a cleaner capture. The{' '}
                <LocaleLink
                  href={Routes.ToolsVoiceRecorder}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  online voice recorder
                </LocaleLink>{' '}
                helps record speech in the browser, and the{' '}
                <LocaleLink
                  href={Routes.ToolsMicTest}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  mic test tool
                </LocaleLink>{' '}
                can confirm that your input device is working before you record.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">
              Tips for Better Echo Removal Results
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Start with a Clear Voice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      Keep the speaker louder than the echo or room tone.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      Avoid clipped peaks because distortion cannot be fully
                      repaired.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      Use WAV or high-quality MP3 when you have a choice.
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Test a Short Segment First
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      Try 30 to 120 seconds before processing a full episode.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      Compare the output for clarity, reverb tail, and natural
                      voice tone.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      Keep the original file so you can reprocess or edit later.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <Card key={item.q}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">
              Start with the Echo Remover Above
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Upload your audio file in the panel above, click Remove Echo
                with AI, and download the cleaner version when processing
                finishes. For best results, use a recording where the speaker is
                clear and the unwanted echo sits behind the voice instead of
                covering it.
              </p>
            </div>
          </section>
        </div>
      </BlurFade>
    </div>
  );
}
