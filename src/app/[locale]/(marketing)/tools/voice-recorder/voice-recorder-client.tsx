'use client';

import { BlurFade } from '@/components/magicui/blur-fade';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Download, Mic, Pause, Play, Square, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function VoiceRecorderClient() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize wavesurfer for real-time recording visualization
  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const WaveSurfer = (await import('wavesurfer.js')).default;
        if (disposed || !waveformRef.current) return;

        const ws = WaveSurfer.create({
          container: waveformRef.current,
          height: 80,
          waveColor: '#cbd5e1',
          progressColor: '#ef4444',
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
      } catch (err) {
        console.error('WaveSurfer initialization failed:', err);
        setError('Failed to initialize audio visualization');
      }
    })();

    return () => {
      disposed = true;
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
    };
  }, []);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording, isPaused]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio level monitoring for real-time visualization
  const startAudioLevelMonitoring = useCallback(
    (stream: MediaStream) => {
      try {
        const audioContext = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateAudioLevel = () => {
          if (analyserRef.current && isRecording) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const average =
              dataArray.reduce((sum, value) => sum + value, 0) /
              dataArray.length;
            setAudioLevel(average / 255); // Normalize to 0-1
            animationRef.current = requestAnimationFrame(updateAudioLevel);
          }
        };

        updateAudioLevel();
      } catch (err) {
        console.error('Failed to start audio level monitoring:', err);
      }
    },
    [isRecording]
  );

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Start audio level monitoring for real-time visualization
      startAudioLevelMonitoring(stream);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop audio level monitoring
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        setAudioLevel(0);

        // Load the recorded audio into wavesurfer for playback
        if (waveSurferRef.current) {
          waveSurferRef.current.load(url);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to access microphone. Please check permissions.');
    }
  }, [startAudioLevelMonitoring]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  // Pause/Resume recording
  const togglePauseRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  }, [isPaused]);

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
  const downloadRecording = useCallback(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

  // Clear recording
  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    if (waveSurferRef.current) {
      waveSurferRef.current.empty();
    }
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
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
              <div
                ref={waveformRef}
                className={cn(
                  'w-full rounded-lg border bg-background/50',
                  !isReady && 'min-h-[80px] flex items-center justify-center'
                )}
              >
                {!isReady && (
                  <div className="text-sm text-muted-foreground">
                    Loading audio visualization...
                  </div>
                )}
              </div>

              {/* Recording indicator and real-time audio level */}
              {isRecording && (
                <>
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full animate-pulse',
                        isPaused ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                    />
                    <span className="text-sm font-mono">
                      {formatTime(recordingTime)}
                    </span>
                  </div>

                  {/* Real-time audio level visualization */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Level:
                      </span>
                      <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                          style={{ width: `${audioLevel * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              {!isRecording && !audioBlob && (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="gap-2"
                  disabled={!isReady}
                >
                  <Mic className="h-4 w-4" />
                  Start Recording
                </Button>
              )}

              {isRecording && (
                <>
                  <Button
                    onClick={togglePauseRecording}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    {isPaused ? (
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

              {audioBlob && (
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
                  >
                    <Download className="h-4 w-4" />
                    Download
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
            {audioBlob && (
              <div className="text-center text-sm text-muted-foreground">
                Recording completed • Duration: {formatTime(recordingTime)} •
                Size: {(audioBlob.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
}
