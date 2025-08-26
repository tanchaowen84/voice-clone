'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import seoContent from '@/content/tools/mic-test-online.en.json';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Mic,
  MicOff,
  Play,
  RefreshCw,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface MicTestState {
  isPermissionGranted: boolean;
  isTestingMic: boolean;
  isRecording: boolean;
  audioLevel: number;
  deviceName: string;
  error: string | null;
  recordedBlob: Blob | null;
  isPlaying: boolean;
}

// Real-time waveform component for microphone visualization
function RealtimeWaveform({
  analyserNode,
  isActive,
}: {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyserNode || !isActive || !canvasRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserNode || !isActive) return;

      analyserNode.getByteFrequencyData(dataArray);

      // Clear canvas with dark background
      ctx.fillStyle = 'rgb(9, 9, 11)'; // zinc-950
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Calculate bar dimensions
      const numBars = Math.min(64, bufferLength); // Limit bars for better visual
      const barWidth = rect.width / numBars - 2;
      const barGap = 2;

      for (let i = 0; i < numBars; i++) {
        // Sample data points for smoother visualization
        const dataIndex = Math.floor((i * bufferLength) / numBars);
        const barHeight = (dataArray[dataIndex] / 255) * rect.height * 0.9;

        const x = i * (barWidth + barGap);
        const y = rect.height - barHeight;

        // Create dynamic gradient based on frequency intensity
        const intensity = dataArray[dataIndex] / 255;
        const gradient = ctx.createLinearGradient(0, y, 0, rect.height);

        if (intensity > 0.7) {
          // High intensity - green to yellow
          gradient.addColorStop(0, '#10b981'); // emerald-500
          gradient.addColorStop(0.5, '#f59e0b'); // amber-500
          gradient.addColorStop(1, '#ef4444'); // red-500
        } else if (intensity > 0.3) {
          // Medium intensity - blue to purple
          gradient.addColorStop(0, '#3b82f6'); // blue-500
          gradient.addColorStop(0.5, '#8b5cf6'); // violet-500
          gradient.addColorStop(1, '#a855f7'); // purple-500
        } else {
          // Low intensity - subtle gray to blue
          gradient.addColorStop(0, '#6b7280'); // gray-500
          gradient.addColorStop(1, '#3b82f6'); // blue-500
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Add subtle glow effect for active bars
        if (intensity > 0.1) {
          ctx.shadowColor = intensity > 0.5 ? '#8b5cf6' : '#3b82f6';
          ctx.shadowBlur = intensity * 10;
          ctx.fillRect(x, y, barWidth, barHeight);
          ctx.shadowBlur = 0;
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [analyserNode, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-20 rounded-lg border bg-zinc-950 shadow-inner"
      style={{ width: '100%', height: '80px' }}
    />
  );
}

export default function MicTestClient() {
  const [state, setState] = useState<MicTestState>({
    isPermissionGranted: false,
    isTestingMic: false,
    isRecording: false,
    audioLevel: 0,
    deviceName: '',
    error: null,
    recordedBlob: null,
    isPlaying: false,
  });

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Start microphone test
  const startMicTest = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isTestingMic: true, error: null }));

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      // Get device information
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(
        (device) => device.kind === 'audioinput'
      );
      const currentDevice = audioInputs.find((device) =>
        stream.getAudioTracks()[0].label.includes(device.label)
      );

      // Set up audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      setState((prev) => ({
        ...prev,
        isPermissionGranted: true,
        isTestingMic: true,
        deviceName: currentDevice?.label || 'Default Microphone',
        error: null,
      }));

      // Start audio level monitoring
      monitorAudioLevel();
    } catch (error: any) {
      let errorMessage = 'Failed to access microphone';

      if (error.name === 'NotAllowedError') {
        errorMessage =
          'Microphone permission denied. Please allow microphone access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage =
          'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is being used by another application.';
      }

      setState((prev) => ({
        ...prev,
        isTestingMic: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Monitor audio level
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateLevel = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedLevel = Math.min(100, (average / 255) * 100);

      setState((prev) => ({ ...prev, audioLevel: normalizedLevel }));

      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }, []);

  // Start recording test
  const startRecording = useCallback(() => {
    if (!mediaStreamRef.current) return;

    try {
      const mediaRecorder = new MediaRecorder(mediaStreamRef.current);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setState((prev) => ({ ...prev, recordedBlob: blob }));
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      setState((prev) => ({ ...prev, isRecording: true }));

      // Auto-stop after 3 seconds
      setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === 'recording'
        ) {
          mediaRecorderRef.current.stop();
          setState((prev) => ({ ...prev, isRecording: false }));
        }
      }, 3000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to start recording. Please try again.',
      }));
    }
  }, []);

  // Play recorded audio
  const playRecording = useCallback(() => {
    if (!state.recordedBlob) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(URL.createObjectURL(state.recordedBlob));
    audioRef.current = audio;

    audio.onplay = () => setState((prev) => ({ ...prev, isPlaying: true }));
    audio.onended = () => setState((prev) => ({ ...prev, isPlaying: false }));
    audio.onerror = () => {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        error: 'Failed to play recording',
      }));
    };

    audio.play().catch(() => {
      setState((prev) => ({
        ...prev,
        error: 'Failed to play recording. Please try again.',
      }));
    });
  }, [state.recordedBlob]);

  // Stop microphone test
  const stopMicTest = useCallback(() => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop recording if active
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }

    // Stop audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setState({
      isPermissionGranted: false,
      isTestingMic: false,
      isRecording: false,
      audioLevel: 0,
      deviceName: '',
      error: null,
      recordedBlob: null,
      isPlaying: false,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicTest();
    };
  }, [stopMicTest]);

  const getVolumeIcon = () => {
    if (state.audioLevel === 0) return <VolumeX className="h-5 w-5" />;
    if (state.audioLevel < 30) return <Volume2 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  const getVolumeColor = () => {
    if (state.audioLevel < 10) return 'bg-red-500';
    if (state.audioLevel < 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{seoContent.hero.title}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {seoContent.hero.subtitle}
        </p>
      </div>

      {/* Main Test Interface */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Microphone Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {/* Test Button */}
          {!state.isTestingMic ? (
            <div className="text-center">
              <Button
                onClick={startMicTest}
                size="lg"
                className="h-16 px-8 text-lg"
              >
                <Mic className="h-6 w-6 mr-2" />
                Test Microphone
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Click to start testing your microphone
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Device Info */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Connected:</span>
                  <span className="text-muted-foreground">
                    {state.deviceName}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={stopMicTest}>
                  <MicOff className="h-4 w-4 mr-1" />
                  Stop Test
                </Button>
              </div>

              {/* Real-time Waveform Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getVolumeIcon()}
                    <span className="font-medium">Audio Waveform</span>
                  </div>
                  <span className="text-sm font-mono">
                    {Math.round(state.audioLevel)}%
                  </span>
                </div>

                {/* Real-time waveform visualization */}
                <div className="relative">
                  <RealtimeWaveform
                    analyserNode={analyserRef.current}
                    isActive={state.isTestingMic}
                  />

                  {/* Overlay volume indicator */}
                  <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        state.audioLevel > 0
                          ? 'bg-green-400 animate-pulse'
                          : 'bg-gray-400'
                      )}
                    />
                    <span>{Math.round(state.audioLevel)}%</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Speak into your microphone to see the real-time waveform
                </p>
              </div>

              {/* Recording Test */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Recording Test</h3>
                  {state.recordedBlob && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={playRecording}
                      disabled={state.isPlaying}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {state.isPlaying ? 'Playing...' : 'Play Recording'}
                    </Button>
                  )}
                </div>

                {!state.recordedBlob ? (
                  <Button
                    onClick={startRecording}
                    disabled={state.isRecording}
                    variant="secondary"
                    className="w-full"
                  >
                    {state.isRecording ? (
                      <>
                        <Square className="h-4 w-4 mr-2 animate-pulse" />
                        Recording... (3s)
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Record 3-Second Test
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-700 dark:text-green-300">
                      Recording successful!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Your microphone is working properly
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Troubleshooting Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common Issues */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Common Issues</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  <div>
                    <strong>No sound detected:</strong> Check if your microphone
                    is connected and not muted
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  <div>
                    <strong>Permission denied:</strong> Click the microphone
                    icon in your browser's address bar to allow access
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  <div>
                    <strong>Low volume:</strong> Increase your microphone volume
                    in system settings
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Fixes */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Quick Fixes</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>

          {/* Browser Compatibility */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-2">Browser Compatibility</h3>
            <p className="text-sm text-muted-foreground">
              This tool works best in modern browsers like Chrome, Firefox,
              Safari, and Edge. Make sure your browser supports WebRTC and has
              microphone permissions enabled.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Common Problems Section */}
      <div className="mb-16">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Fix Common Microphone Problems Before They Ruin Your Call
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
              Don't let microphone issues embarrass you in important meetings or
              ruin your recordings. Test your mic now to avoid these common
              problems.
            </p>

            {/* Common Issues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    People Can't Hear You in Zoom/Teams
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Wrong microphone selected or permissions blocked
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    Audio Cuts Out During Recording
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Microphone sensitivity too low or hardware issues
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    Gaming/Discord Voice Chat Problems
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Headset microphone not detected or poor quality
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    Podcast/Streaming Audio Issues
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Background noise, echo, or inconsistent volume levels
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {seoContent.features.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
            {seoContent.features.subtitle}
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {seoContent.features.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seoContent.features.items.map((feature, index) => (
            <Card key={index} className="text-center p-6 h-full">
              <div className="flex flex-col h-full">
                {feature.icon === 'waveform' && (
                  <Volume2 className="h-8 w-8 text-primary mx-auto mb-4" />
                )}
                {feature.icon === 'shield' && (
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                )}
                {feature.icon === 'record' && (
                  <Play className="h-8 w-8 text-primary mx-auto mb-4" />
                )}
                {feature.icon === 'devices' && (
                  <HelpCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                )}
                {feature.icon === 'analytics' && (
                  <Volume2 className="h-8 w-8 text-primary mx-auto mb-4" />
                )}
                {feature.icon === 'lock' && (
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                )}

                <h3 className="font-semibold mb-3 text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground flex-grow">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {seoContent.howItWorks.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
            {seoContent.howItWorks.subtitle}
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {seoContent.howItWorks.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {seoContent.howItWorks.steps.map((step, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-lg">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* When to Test Your Microphone */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            When Should You Test Your Microphone?
          </h2>
          <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
            Don't wait until it's too late. Test your microphone in these
            critical situations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Volume2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">
                  Before Important Video Calls
                </h3>
                <p className="text-sm text-muted-foreground">
                  Test 5 minutes before your Zoom, Teams, or Google Meet calls.
                  Avoid the embarrassment of "Can you hear me?" moments during
                  client presentations or job interviews.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">
                  After Buying New Equipment
                </h3>
                <p className="text-sm text-muted-foreground">
                  New headset, USB microphone, or gaming headphones? Test
                  immediately to ensure they work properly and return defective
                  products within the warranty period.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">
                  Before Recording Content
                </h3>
                <p className="text-sm text-muted-foreground">
                  Podcasters, YouTubers, and streamers: test your mic before
                  hitting record. Prevent wasted hours re-recording due to poor
                  audio quality or technical issues.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">
                  When Troubleshooting Issues
                </h3>
                <p className="text-sm text-muted-foreground">
                  Friends complaining they can't hear you in Discord? Microphone
                  suddenly stopped working? Use our test to quickly identify if
                  it's a hardware or software problem.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Solutions Section */}
      <div className="mb-16">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">
            Quick Microphone Fixes That Actually Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Windows Users</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Check Privacy Settings
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Settings → Privacy → Microphone → Allow apps to access
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Update Audio Drivers</p>
                    <p className="text-xs text-muted-foreground">
                      Device Manager → Audio inputs → Update driver
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Set Default Device</p>
                    <p className="text-xs text-muted-foreground">
                      Sound settings → Choose input device
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Mac Users</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Check System Preferences
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Security & Privacy → Microphone → Allow browser
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Reset Audio Settings</p>
                    <p className="text-xs text-muted-foreground">
                      Sound → Input → Select correct microphone
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Restart Core Audio</p>
                    <p className="text-xs text-muted-foreground">
                      Terminal: sudo killall coreaudiod
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Still having issues?</strong> Try our mic test first to
              determine if it's a hardware or software problem. This will save
              you time troubleshooting the wrong component.
            </p>
          </div>
        </Card>
      </div>

      {/* Comprehensive Mic Test Guide */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Complete Mic Test Online Guide
          </h2>
          <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
            Everything you need to know about microphone test online procedures
            and best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Why Use Our Mic Test Online Tool?
            </h3>
            <div className="space-y-3 text-sm">
              <p>
                Our mic test online platform provides instant microphone testing
                without downloads or installations. This microphone test online
                solution works directly in your browser, making it the most
                convenient way to test your microphone before important calls or
                recordings.
              </p>
              <p>
                Unlike other microphone test online tools, our mic test online
                service offers real-time waveform visualization, allowing you to
                see exactly how your microphone responds to different audio
                levels. This advanced microphone test online feature helps
                identify issues that basic mic test tools might miss.
              </p>
              <p>
                Whether you need a quick mic test online for a Zoom meeting or
                comprehensive microphone test online analysis for content
                creation, our tool provides accurate results every time. The mic
                test online process is completely free and requires no
                registration.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Best Practices for Mic Test Online
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Test in Quiet Environment</p>
                  <p className="text-muted-foreground">
                    Perform your mic test online in a quiet room to get accurate
                    results from our microphone test online tool.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Speak at Normal Volume</p>
                  <p className="text-muted-foreground">
                    Use your regular speaking voice during the microphone test
                    online to simulate real-world usage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Test Multiple Scenarios</p>
                  <p className="text-muted-foreground">
                    Try different distances and angles during your mic test
                    online to find optimal positioning.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Use Recording Playback</p>
                  <p className="text-muted-foreground">
                    Always test the recording playback feature in our microphone
                    test online tool to hear your actual audio quality.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Device Compatibility */}
      <div className="mb-16">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Mic Test Online Device Compatibility
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
              Our microphone test online tool works seamlessly across all
              devices and platforms. Test your microphone online regardless of
              your setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold mb-3">Desktop Computers</h3>
              <p className="text-sm text-muted-foreground">
                Full mic test online functionality on Windows, Mac, and Linux.
                Our microphone test online tool supports USB microphones,
                built-in mics, and professional audio interfaces.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-3">Mobile Devices</h3>
              <p className="text-sm text-muted-foreground">
                Complete microphone test online experience on iOS and Android.
                Test your phone's built-in microphone or connected headsets with
                our mobile-optimized mic test online interface.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-3">Gaming Headsets</h3>
              <p className="text-sm text-muted-foreground">
                Perfect for testing gaming headsets and wireless earbuds. Our
                mic test online tool helps gamers verify their microphone works
                properly for Discord, Steam, and other platforms.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
