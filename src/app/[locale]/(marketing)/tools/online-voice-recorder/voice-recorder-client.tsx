'use client';

import seoContent from '@/../content/tools/online-voice-recorder.en.json';
import { BlurFade } from '@/components/magicui/blur-fade';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import {
  convertWebMToWAV,
  isAudioConversionSupported,
} from '@/utils/audio-converter';
import {
  ArrowRight,
  CheckCircle,
  Download,
  Globe,
  Lock,
  MessageSquare,
  Mic,
  Music,
  Pause,
  Play,
  Shield,
  Square,
  Trash2,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { VoiceVisualizer, useVoiceVisualizer } from 'react-voice-visualizer';

export default function VoiceRecorderClient() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Use react-voice-visualizer for recording and real-time visualization
  const recorderControls = useVoiceVisualizer();
  const {
    recordedBlob,
    recordingTime,
    isRecordingInProgress,
    isPausedRecording,
    startRecording,
    stopRecording,
    togglePauseResume,
  } = recorderControls;

  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<any>(null);

  // Initialize wavesurfer for playback after recording
  useEffect(() => {
    let disposed = false;

    const initWaveSurfer = async () => {
      try {
        const WaveSurfer = (await import('wavesurfer.js')).default;
        if (disposed || !waveformRef.current) return;

        // Destroy existing instance if any
        if (waveSurferRef.current) {
          waveSurferRef.current.destroy();
        }

        const ws = WaveSurfer.create({
          container: waveformRef.current,
          height: 80,
          waveColor: '#cbd5e1',
          progressColor: '#7c3aed',
          cursorColor: '#94a3b8',
          barWidth: 2,
          barGap: 1,
          normalize: true,
        });

        waveSurferRef.current = ws;

        // Add event listeners for playback control
        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));
        ws.on('finish', () => setIsPlaying(false));

        setIsReady(true);
        console.log('WaveSurfer initialized successfully');
      } catch (err) {
        console.error('WaveSurfer initialization failed:', err);
        setError('Failed to initialize audio visualization');
      }
    };

    // Initialize when not recording and container is available
    if (!isRecordingInProgress && !isPausedRecording && waveformRef.current) {
      initWaveSurfer();
    }

    return () => {
      disposed = true;
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
    };
  }, [isRecordingInProgress, isPausedRecording]);

  // Handle recorded blob from react-voice-visualizer
  useEffect(() => {
    if (recordedBlob && waveSurferRef.current && isReady) {
      const url = URL.createObjectURL(recordedBlob);
      setAudioUrl(url);

      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (waveSurferRef.current) {
          console.log('Loading audio into wavesurfer:', url);
          waveSurferRef.current.load(url);
        }
      }, 100);
    }
  }, [recordedBlob, isReady]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Play/Pause recorded audio
  const togglePlayback = useCallback(() => {
    if (waveSurferRef.current && audioUrl) {
      if (isPlaying) {
        waveSurferRef.current.pause();
      } else {
        waveSurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, audioUrl]);

  // Download recorded audio
  const downloadRecording = useCallback(async () => {
    if (!recordedBlob) return;

    setIsDownloading(true);
    try {
      let downloadBlob = recordedBlob;
      let fileName = `voice-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;

      // Try to convert to WAV format for better compatibility
      if (isAudioConversionSupported()) {
        try {
          console.log('Converting WebM to WAV...');
          downloadBlob = await convertWebMToWAV(recordedBlob);
          fileName += '.wav';
          console.log('Conversion successful');
        } catch (conversionError) {
          console.warn(
            'WAV conversion failed, downloading as WebM:',
            conversionError
          );
          fileName += '.webm';
        }
      } else {
        console.warn('Audio conversion not supported, downloading as WebM');
        fileName += '.webm';
      }

      // Create download link
      const url = URL.createObjectURL(downloadBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download recording. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [recordedBlob]);

  // Clear recording
  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setIsPlaying(false);
    if (waveSurferRef.current) {
      waveSurferRef.current.empty();
    }
    // Clear the react-voice-visualizer recording
    recorderControls.clearCanvas();
  }, [audioUrl, recorderControls]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Hero Section */}
      <BlurFade>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-4">
            {seoContent.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            {seoContent.hero.subtitle}
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
            {seoContent.hero.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {seoContent.hero.bullets.map((bullet, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {bullet}
              </Badge>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Main Recording Interface */}
      <BlurFade delay={0.1}>
        <Card className="mb-8" data-testid="voice-recorder">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Online Voice Recorder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Waveform Visualization */}
            <div className="relative">
              {/* Show react-voice-visualizer during recording */}
              {(isRecordingInProgress || isPausedRecording) && (
                <div className="relative">
                  <VoiceVisualizer
                    controls={recorderControls}
                    height={80}
                    backgroundColor="transparent"
                    mainBarColor="#ef4444"
                    secondaryBarColor="#fca5a5"
                    speed={3}
                    barWidth={2}
                    gap={1}
                    rounded={2}
                    isControlPanelShown={false}
                    isDownloadAudioButtonShown={false}
                  />

                  {/* Recording indicator */}
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full animate-pulse',
                        isPausedRecording ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                    />
                    <span className="text-sm font-mono">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                </div>
              )}

              {/* Show wavesurfer for playback after recording */}
              {!isRecordingInProgress && !isPausedRecording && (
                <div
                  ref={waveformRef}
                  className={cn(
                    'w-full rounded-lg border bg-background/50 min-h-[80px]',
                    !isReady &&
                      !recordedBlob &&
                      'flex items-center justify-center'
                  )}
                >
                  {!isReady && !recordedBlob && (
                    <div className="text-sm text-muted-foreground">
                      Ready to record...
                    </div>
                  )}
                  {recordedBlob && !isReady && (
                    <div className="text-sm text-muted-foreground flex items-center justify-center">
                      Loading waveform...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              {!isRecordingInProgress &&
                !isPausedRecording &&
                !recordedBlob && (
                  <Button onClick={startRecording} size="lg" className="gap-2">
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </Button>
                )}

              {(isRecordingInProgress || isPausedRecording) && (
                <>
                  <Button
                    onClick={togglePauseResume}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    {isPausedRecording ? (
                      <>
                        <Play className="h-4 w-4" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="lg"
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </Button>
                </>
              )}

              {recordedBlob && !isRecordingInProgress && !isPausedRecording && (
                <>
                  <Button
                    onClick={togglePlayback}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Play
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={downloadRecording}
                    size="lg"
                    className="gap-2"
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading ? 'Converting...' : 'Download WAV'}
                  </Button>
                  <Button
                    onClick={clearRecording}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    onClick={startRecording}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    Record Again
                  </Button>
                </>
              )}
            </div>

            {/* Recording Status */}
            {recordedBlob && (
              <div className="text-center text-sm text-muted-foreground space-y-1">
                <div>
                  Recording completed • Duration: {formatTime(recordingTime)} •
                  Size: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
                </div>
                <div className="text-xs">
                  {isAudioConversionSupported()
                    ? 'Download will be converted to WAV format for better compatibility'
                    : 'Download will be in WebM format'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </BlurFade>

      {/* SEO Content Sections */}
      <div className="mt-16 space-y-16">
        {/* Features Section */}
        <BlurFade delay={0.2}>
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {seoContent.features.title}
            </h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              {seoContent.features.subtitle}
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-3xl mx-auto">
              {seoContent.features.intro}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seoContent.features.items.map((feature, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {feature.icon === 'shield' && (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                    {feature.icon === 'lock' && (
                      <Lock className="h-5 w-5 text-primary" />
                    )}
                    {feature.icon === 'download' && (
                      <Download className="h-5 w-5 text-primary" />
                    )}
                    {feature.icon === 'enhance' && (
                      <Zap className="h-5 w-5 text-primary" />
                    )}
                    {feature.icon === 'waveform' && (
                      <Mic className="h-5 w-5 text-primary" />
                    )}
                    {feature.icon === 'devices' && (
                      <Globe className="h-5 w-5 text-primary" />
                    )}
                    <h3 className="font-medium">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </BlurFade>

        {/* How It Works Section */}
        <BlurFade delay={0.3}>
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {seoContent.howItWorks.title}
            </h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              {seoContent.howItWorks.subtitle}
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-3xl mx-auto">
              {seoContent.howItWorks.intro}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {seoContent.howItWorks.steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-medium mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {index < seoContent.howItWorks.steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-6 -right-3 h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </BlurFade>

        {/* Use Cases Section */}
        <BlurFade delay={0.4}>
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {seoContent.useCases.title}
            </h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              {seoContent.useCases.subtitle}
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-3xl mx-auto">
              {seoContent.useCases.intro}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seoContent.useCases.items.map((useCase, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {useCase.icon === 'microphone' && (
                      <Mic className="h-5 w-5 text-primary" />
                    )}
                    {useCase.icon === 'meeting' && (
                      <Users className="h-5 w-5 text-primary" />
                    )}
                    {useCase.icon === 'content' && (
                      <Video className="h-5 w-5 text-primary" />
                    )}
                    {useCase.icon === 'memo' && (
                      <MessageSquare className="h-5 w-5 text-primary" />
                    )}
                    {useCase.icon === 'language' && (
                      <Globe className="h-5 w-5 text-primary" />
                    )}
                    {useCase.icon === 'music' && (
                      <Music className="h-5 w-5 text-primary" />
                    )}
                    <h3 className="font-medium">{useCase.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </BlurFade>

        {/* Best Practices Section */}
        <BlurFade delay={0.5}>
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {seoContent.bestPractices.title}
            </h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              {seoContent.bestPractices.subtitle}
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-3xl mx-auto">
              {seoContent.bestPractices.intro}
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {seoContent.bestPractices.items.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </BlurFade>

        {/* Privacy Section */}
        <BlurFade delay={0.6}>
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {seoContent.privacy.title}
            </h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              {seoContent.privacy.subtitle}
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-3xl mx-auto">
              {seoContent.privacy.intro}
            </p>
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <ul className="space-y-3 text-left">
                  {seoContent.privacy.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        </BlurFade>

        {/* Technical Specifications Section */}
        <BlurFade delay={0.7}>
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {seoContent.techSpecs.title}
            </h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              {seoContent.techSpecs.subtitle}
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-3xl mx-auto">
              {seoContent.techSpecs.intro}
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seoContent.techSpecs.specs.map((spec, index) => (
                  <Card key={index} className="p-4 text-left">
                    <div className="font-medium text-sm mb-2">{spec.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {spec.value}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </BlurFade>

        {/* FAQ Section */}
        <BlurFade delay={0.8}>
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {seoContent.faq.title}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {seoContent.faq.subtitle}
            </p>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="text-left">
                {seoContent.faq.items.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </BlurFade>

        {/* CTA Section */}
        <BlurFade delay={0.9}>
          <section className="text-center">
            <Card className="p-12 bg-gradient-to-r from-primary/5 to-primary/10">
              <h2 className="text-2xl font-semibold mb-4">
                {seoContent.cta.title}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {seoContent.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    document
                      .querySelector('[data-testid="voice-recorder"]')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Mic className="h-4 w-4" />
                  {seoContent.cta.buttons.primary}
                </Button>
                <LocaleLink href={Routes.ToolsAudioEnhancer}>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Zap className="h-4 w-4" />
                    {seoContent.cta.buttons.secondary}
                  </Button>
                </LocaleLink>
              </div>
            </Card>
          </section>
        </BlurFade>
      </div>
    </div>
  );
}
