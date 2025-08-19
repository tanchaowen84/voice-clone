'use client';

import { BlurFade } from '@/components/magicui/blur-fade';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  convertWebMToWAV,
  isAudioConversionSupported,
} from '@/utils/audio-converter';
import { Download, Mic, Pause, Play, Square, Trash2 } from 'lucide-react';
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
          responsive: true,
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
            Online Voice Recorder
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Record high-quality audio directly in your browser with real-time
            waveform visualization. Perfect for voice memos, interviews,
            podcasts, and more.
          </p>
        </div>
      </BlurFade>

      {/* Main Recording Interface */}
      <BlurFade delay={0.1}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Recorder
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
    </div>
  );
}
