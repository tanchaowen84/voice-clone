'use client';

import { BlurFade } from '@/components/magicui/blur-fade';
import { WaveAudioPlayer } from '@/components/media/wave-audio-player';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
                Echo Removed Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <WaveAudioPlayer src={enhancedUrl} title="Echo Removed Audio" />
                <Button onClick={downloadEnhanced} className="w-full" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Echo-Free Audio
                </Button>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      )}

      {/* Content Section */}
      <BlurFade delay={0.5}>
        <div className="mt-16 space-y-12">
          {/* What is Echo Remover AI */}
          <section>
            <h2 className="text-3xl font-bold mb-6">
              What is Echo Remover AI?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Our <strong>echo remover AI</strong> is a cutting-edge
                artificial intelligence tool designed to eliminate unwanted echo
                and reverb from your audio recordings. Whether you're dealing
                with podcast recordings, video calls, interviews, or
                voice-overs, this advanced <strong>echo remover</strong> uses
                sophisticated AI algorithms to analyze and remove echo artifacts
                while preserving the natural quality of your voice.
              </p>
              <p>
                Unlike traditional audio editing software that requires
                technical expertise, our AI-powered{' '}
                <strong>echo remover</strong> works automatically. Simply upload
                your audio file, and our intelligent system will identify echo
                patterns and remove them instantly, giving you
                professional-quality results in seconds.
              </p>
            </div>
          </section>

          {/* How Does Echo Remover AI Work */}
          <section>
            <h2 className="text-3xl font-bold mb-6">
              How Does Our Echo Remover Work?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Our <strong>echo remover AI</strong> employs advanced machine
                learning models trained on thousands of audio samples to
                recognize and eliminate echo patterns. The AI analyzes your
                audio file in real-time, identifying the original sound waves
                and distinguishing them from echo reflections.
              </p>
              <p>
                The process involves three key steps: First, the{' '}
                <strong>echo remover</strong> scans your audio to detect echo
                signatures and reverb patterns. Second, it applies intelligent
                filtering to separate the direct audio from the reflected
                sounds. Finally, it reconstructs the clean audio while
                maintaining the original voice characteristics and natural
                dynamics.
              </p>
              <p>
                This sophisticated approach ensures that while echo is removed
                effectively, your voice retains its warmth, clarity, and natural
                tone. The result is professional-quality audio that sounds like
                it was recorded in a treated acoustic environment.
              </p>
            </div>
          </section>

          {/* Common Echo Problems */}
          <section>
            <h2 className="text-3xl font-bold mb-6">
              Common Echo Problems This Tool Solves
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Room Echo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Hard surfaces in untreated rooms create unwanted
                    reflections. Our <strong>echo remover AI</strong>{' '}
                    effectively eliminates these room acoustics issues, making
                    your recordings sound professional regardless of your
                    recording environment.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Video Call Echo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Recorded video calls often suffer from echo due to poor
                    audio setups. This <strong>echo remover</strong> can clean
                    up these recordings, making them suitable for content
                    creation or professional presentations.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Podcast Reverb</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Home podcast setups frequently produce reverb and echo. Our
                    AI-powered <strong>echo remover</strong> transforms amateur
                    recordings into broadcast-quality audio that engages
                    listeners.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Interview Echo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Remote interviews and phone recordings often have echo
                    issues. This <strong>echo remover AI</strong> ensures your
                    important conversations are clear and professional-sounding.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="text-3xl font-bold mb-6">
              Why Choose Our Echo Remover AI?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Professional audio editing traditionally requires expensive
                software and years of experience. Our{' '}
                <strong>echo remover AI</strong> democratizes audio enhancement,
                making professional-quality results accessible to everyone.
                Whether you're a content creator, podcaster, educator, or
                business professional, this tool delivers consistent,
                high-quality results.
              </p>
              <p>
                The AI-powered approach means you don't need to understand
                complex audio engineering concepts. The{' '}
                <strong>echo remover</strong> automatically adjusts its
                processing based on your specific audio characteristics,
                ensuring optimal results every time. This intelligent adaptation
                is what sets our tool apart from generic audio filters.
              </p>
              <p>
                Speed is another crucial advantage. While manual echo removal
                can take hours of careful editing, our{' '}
                <strong>echo remover AI</strong> processes your files in
                seconds. This efficiency makes it perfect for content creators
                who need to process multiple recordings quickly without
                compromising quality.
              </p>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="text-3xl font-bold mb-6">
              Perfect for These Scenarios
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-3" />
                <div>
                  <h3 className="font-semibold mb-2">Content Creators</h3>
                  <p className="text-muted-foreground">
                    YouTube creators, TikTok producers, and social media
                    influencers use our <strong>echo remover</strong> to ensure
                    their voice-overs and talking head videos sound professional
                    and engaging.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-3" />
                <div>
                  <h3 className="font-semibold mb-2">Podcasters</h3>
                  <p className="text-muted-foreground">
                    Independent podcasters rely on this{' '}
                    <strong>echo remover AI</strong> to transform home
                    recordings into broadcast-quality audio that keeps listeners
                    engaged throughout entire episodes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-3" />
                <div>
                  <h3 className="font-semibold mb-2">Business Professionals</h3>
                  <p className="text-muted-foreground">
                    Sales teams, trainers, and consultants use our{' '}
                    <strong>echo remover</strong> to clean up recorded
                    presentations, client calls, and training materials for
                    professional distribution.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-3" />
                <div>
                  <h3 className="font-semibold mb-2">Educators</h3>
                  <p className="text-muted-foreground">
                    Teachers and online course creators utilize this{' '}
                    <strong>echo remover AI</strong> to ensure their educational
                    content is clear and easy to understand, improving student
                    learning outcomes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section>
            <h2 className="text-3xl font-bold mb-6">
              Get Started with Echo Removal
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Using our <strong>echo remover AI</strong> is incredibly simple.
                Upload your audio file using the interface above, click the
                enhancement button, and download your echo-free audio in
                seconds. The tool supports all major audio formats including
                WAV, MP3, FLAC, and OGG files up to 50MB.
              </p>
              <p>
                For best results, ensure your original recording has the
                speaker's voice clearly audible above the echo. While our{' '}
                <strong>echo remover</strong> is highly effective, starting with
                the highest quality source material will always yield the best
                results.
              </p>
              <p>
                Ready to transform your audio? Upload your file now and
                experience the power of AI-driven echo removal. Join thousands
                of creators who trust our <strong>echo remover AI</strong> for
                their professional audio needs.
              </p>
            </div>
          </section>
        </div>
      </BlurFade>
    </div>
  );
}
