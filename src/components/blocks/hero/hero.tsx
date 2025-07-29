'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Download, Loader2, Play, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface Voice {
  id: string;
  displayName: string;
  gender: string;
  locale?: string;
  type?: string;
  avatarImage?: string;
  previewAudio?: string;
  tags?: string[];
}

export default function HeroSection() {
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [generatedAudio, setGeneratedAudio] = useState<string>('');
  const [consent, setConsent] = useState(false);

  const audioFileRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  const handleCreateVoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData(e.currentTarget);
    const audioFile = audioFileRef.current?.files?.[0];

    if (!audioFile) {
      alert('Please select an audio file');
      setIsCreating(false);
      return;
    }

    formData.append('audio', audioFile);
    formData.append('consent', consent.toString());

    try {
      const response = await fetch('/api/voice-clone/create', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('Voice cloned successfully!');
        loadVoices();
        // Reset form
        e.currentTarget.reset();
        setConsent(false);
      } else {
        alert(result.error || 'Failed to clone voice');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to clone voice');
    } finally {
      setIsCreating(false);
    }
  };

  const loadVoices = async () => {
    setIsLoadingVoices(true);
    try {
      const response = await fetch('/api/voice-clone/voices', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const result = await response.json();

      if (result.success) {
        setVoices(result.voices);
      }
    } catch (error) {
      console.error('Error loading voices:', error);
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const handleGenerateSpeech = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);

    const formData = new FormData(e.currentTarget);
    const text = formData.get('text') as string;

    try {
      const response = await fetch('/api/voice-clone/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice,
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setGeneratedAudio(audioUrl);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate speech');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate speech');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <main id="hero" className="overflow-hidden">
        {/* background, light shadows on top of the hero section */}
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section>
          <div className="relative pt-12">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                {/* title */}
                <h1 className="mt-8 text-balance text-5xl font-bricolage-grotesque lg:mt-16 xl:text-[5rem]">
                  Clone Your Voice with AI
                </h1>

                {/* description */}
                <p className="mx-auto mt-8 max-w-4xl text-balance text-lg text-muted-foreground">
                  Transform your voice into AI-powered speech synthesis. Upload
                  audio samples, create personalized voice clones, and generate
                  natural-sounding speech from any text.
                </p>
              </div>
            </div>

            {/* Voice Clone Interface */}
            <div className="mt-16 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Create Voice Clone */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Voice Clone</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateVoice} className="space-y-4">
                        <div>
                          <Label htmlFor="audio-file">Audio Sample</Label>
                          <Input
                            id="audio-file"
                            type="file"
                            accept="audio/*"
                            ref={audioFileRef}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="voice-name">Voice Name</Label>
                          <Input
                            id="voice-name"
                            name="name"
                            placeholder="Enter voice name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="full-name">Your Full Name</Label>
                          <Input
                            id="full-name"
                            name="fullName"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Your Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select name="gender" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="consent"
                            checked={consent}
                            onCheckedChange={(checked) =>
                              setConsent(checked as boolean)
                            }
                            required
                          />
                          <Label htmlFor="consent" className="text-sm">
                            I confirm that this voice belongs to me or someone I
                            represent, and I consent to providing my personal
                            information for voice cloning purposes
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          disabled={isCreating || !consent}
                          className="w-full"
                        >
                          {isCreating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Create Voice Clone
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Generate Speech */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Generate Speech
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadVoices}
                          disabled={isLoadingVoices}
                        >
                          {isLoadingVoices ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Load Voices'
                          )}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={handleGenerateSpeech}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="voice-select">Select Voice</Label>
                          <Select
                            value={selectedVoice}
                            onValueChange={setSelectedVoice}
                            required
                          >
                            <SelectTrigger className="w-full min-w-[200px]">
                              <SelectValue placeholder="Select a voice" />
                            </SelectTrigger>
                            <SelectContent>
                              {voices.map((voice) => (
                                <SelectItem key={voice.id} value={voice.id}>
                                  {voice.displayName} ({voice.gender})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="text-input">Text to Speech</Label>
                          <Textarea
                            id="text-input"
                            name="text"
                            placeholder="Enter text to convert to speech..."
                            rows={4}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isGenerating || !selectedVoice}
                          className="w-full"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Generate Speech
                            </>
                          )}
                        </Button>
                      </form>

                      {generatedAudio && (
                        <div className="mt-6 space-y-4">
                          <Label>Generated Audio</Label>
                          <audio
                            ref={audioPlayerRef}
                            controls
                            src={generatedAudio}
                            className="w-full"
                          >
                            <track
                              kind="captions"
                              src=""
                              srcLang="en"
                              label="English captions"
                            />
                          </audio>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = generatedAudio;
                              a.download = 'generated-speech.mp3';
                              a.click();
                            }}
                            className="w-full"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Audio
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
