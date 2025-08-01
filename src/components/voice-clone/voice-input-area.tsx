'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useVoiceCloneStore } from '@/stores/voice-clone-store';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FileUploader } from './file-uploader';
import { VoiceRecorder } from './voice-recorder';

/**
 * Voice Input Area Component
 * Dynamically renders content based on inputMode and currentStep
 */
export function VoiceInputArea() {
  const {
    inputMode,
    currentStep,
    isGenerating,
    generatedAudioUrl,
    error,
    generateSpeech,
    reset,
  } = useVoiceCloneStore();

  const [textInput, setTextInput] = useState(
    'Transform your text into natural-sounding speech with AI voice cloning technology.'
  );

  const handleGenerateSpeech = async () => {
    if (!textInput.trim()) return;
    await generateSpeech(textInput);
  };

  const handleDownload = () => {
    if (generatedAudioUrl) {
      const link = document.createElement('a');
      link.href = generatedAudioUrl;
      link.download = 'generated-speech.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleStartOver = () => {
    reset();
    setTextInput(
      'Transform your text into natural-sounding speech with AI voice cloning technology.'
    );
  };

  // Show text input interface when audio is ready
  if (currentStep === 'generate') {
    return (
      <div className="space-y-6">
        <Card className="border-2 shadow-xl bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Generate Speech with Your Voice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-lg font-semibold mb-3 block">
                Enter text to convert to speech:
              </label>
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-32 text-lg border-2 rounded-xl resize-none"
                maxLength={500}
              />
              <div className="text-sm text-muted-foreground mt-2 text-right">
                {textInput.length}/500 characters
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGenerateSpeech}
              disabled={isGenerating || !textInput.trim()}
              size="lg"
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Generating Speech...
                </>
              ) : (
                'Generate Speech'
              )}
            </Button>
          </CardContent>
        </Card>

        {generatedAudioUrl && (
          <Card className="border-2 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                  Speech Generated Successfully!
                </h3>

                <audio
                  controls
                  src={generatedAudioUrl}
                  className="w-full max-w-md mx-auto"
                >
                  Your browser does not support the audio element.
                </audio>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Audio
                  </Button>

                  <Button onClick={handleStartOver} variant="outline" size="lg">
                    Start Over
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Show input interface based on mode
  if (currentStep === 'input') {
    return (
      <div className="space-y-6">
        {inputMode === 'record' ? (
          // Recording Interface
          <VoiceRecorder />
        ) : (
          // Upload Interface
          <FileUploader />
        )}

        {/* Sample text guidance - only show in record mode */}
        {inputMode === 'record' && (
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-foreground mb-3">
              Read this sample text aloud:
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              "Hello everyone! I'm trying out this amazing voice cloning
              technology. This sample will help create a high-quality voice
              model that captures my unique speaking style and tone. The more
              natural I sound, the better the results will be."
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
