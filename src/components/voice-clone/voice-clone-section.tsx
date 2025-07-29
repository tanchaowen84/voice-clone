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
import { Download, Loader2, Play, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface Voice {
  id: string;
  name: string;
  gender: string;
}

export function VoiceCloneSection() {
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
      const response = await fetch('/api/voice-clone/voices');
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

  const handleDeleteVoice = async (voiceId: string) => {
    if (!confirm('Are you sure you want to delete this voice?')) return;

    try {
      const response = await fetch('/api/voice-clone/voices', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voiceId }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Voice deleted successfully');
        loadVoices();
        if (selectedVoice === voiceId) {
          setSelectedVoice('');
        }
      } else {
        alert(result.error || 'Failed to delete voice');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete voice');
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Voice Clone</h2>
          <p className="text-muted-foreground">
            Clone your voice and generate speech with AI
          </p>
        </div>

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
                    represent
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
              <form onSubmit={handleGenerateSpeech} className="space-y-4">
                <div>
                  <Label htmlFor="voice-select">Select Voice</Label>
                  <Select
                    value={selectedVoice}
                    onValueChange={setSelectedVoice}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name} ({voice.gender})
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

        {/* Voice Management Section */}
        {voices.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Manage Your Voices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {voices.map((voice) => (
                  <div
                    key={voice.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{voice.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Gender: {voice.gender}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteVoice(voice.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
