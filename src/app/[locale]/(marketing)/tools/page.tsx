'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LocaleLink } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { ArrowRight, Sparkles } from 'lucide-react';
import Head from 'next/head';

export default function ToolsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* noindex for SEO */}
      <Head>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <header className="mb-10">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <Sparkles className="h-6 w-6" /> Tools
        </h1>
        <p className="text-muted-foreground mt-2">
          Simple collection of handy tools. Explore and use them directly.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-medium">Audio</h2>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio Enhancer */}
          <Card>
            <CardHeader>
              <CardTitle>Audio Enhancer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Enhance audio quality with our online enhancer powered by
                DeepFilterNet.
              </p>
              <div>
                <LocaleLink href={Routes.ToolsAudioEnhancer}>
                  <Button>
                    <span className="inline-flex items-center gap-2">
                      Open <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </LocaleLink>
              </div>
            </CardContent>
          </Card>

          {/* Voice Recorder */}
          <Card>
            <CardHeader>
              <CardTitle>Online Voice Recorder</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Record high-quality audio directly in your browser with
                real-time waveform visualization.
              </p>
              <div>
                <LocaleLink href={Routes.ToolsVoiceRecorder}>
                  <Button>
                    <span className="inline-flex items-center gap-2">
                      Open <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </LocaleLink>
              </div>
            </CardContent>
          </Card>

          {/* Mic Test */}
          <Card>
            <CardHeader>
              <CardTitle>Mic Test Online</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Test your microphone instantly. Check volume levels, audio
                quality, and device compatibility right in your browser.
              </p>
              <div>
                <LocaleLink href={Routes.ToolsMicTest}>
                  <Button>
                    <span className="inline-flex items-center gap-2">
                      Open <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </LocaleLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
