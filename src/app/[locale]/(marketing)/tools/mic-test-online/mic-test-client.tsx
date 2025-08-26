'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Mic,
  MicOff,
  Play,
  RefreshCw,
  Settings,
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Mic Test Online</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test your microphone instantly. Check volume levels, audio quality,
          and device compatibility right in your browser.
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

              {/* Volume Level Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getVolumeIcon()}
                    <span className="font-medium">Volume Level</span>
                  </div>
                  <span className="text-sm font-mono">
                    {Math.round(state.audioLevel)}%
                  </span>
                </div>

                <div className="relative">
                  <Progress value={state.audioLevel} className="h-4" />
                  <div
                    className={cn(
                      'absolute top-0 left-0 h-4 rounded-full transition-all duration-100',
                      getVolumeColor()
                    )}
                    style={{ width: `${state.audioLevel}%` }}
                  />
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Speak into your microphone to see the volume level
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    if (navigator.userAgent.includes('Chrome')) {
                      window.open(
                        'chrome://settings/content/microphone',
                        '_blank'
                      );
                    } else if (navigator.userAgent.includes('Firefox')) {
                      window.open('about:preferences#privacy', '_blank');
                    } else {
                      alert(
                        'Please check your browser settings for microphone permissions'
                      );
                    }
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Browser Settings
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

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="text-center p-6">
          <Mic className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-medium mb-2">Real-time Testing</h3>
          <p className="text-sm text-muted-foreground">
            Instant feedback on your microphone's volume levels and audio
            quality
          </p>
        </Card>

        <Card className="text-center p-6">
          <Volume2 className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-medium mb-2">Volume Monitoring</h3>
          <p className="text-sm text-muted-foreground">
            Visual volume meter shows your microphone's sensitivity in real-time
          </p>
        </Card>

        <Card className="text-center p-6">
          <Play className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-medium mb-2">Recording Test</h3>
          <p className="text-sm text-muted-foreground">
            Record and playback a sample to verify your microphone quality
          </p>
        </Card>
      </div>
    </div>
  );
}
