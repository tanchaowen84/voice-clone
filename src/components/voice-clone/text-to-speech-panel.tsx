'use client';

import { Download, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const DEFAULT_VOICE = process.env.NEXT_PUBLIC_SPEECHIFY_DEFAULT_VOICE_ID || 'george';

const LANGUAGE_OPTIONS = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'English (UK)', value: 'en-GB' },
  { label: '中文（中国）', value: 'zh-CN' },
];

export function TextToSpeechPanel() {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE);
  const [language, setLanguage] = useState('en-US');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charCount = useMemo(() => text.length, [text]);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/tts/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          voiceId,
          language,
          audioFormat: 'mp3',
          model: language.startsWith('en')
            ? 'simba-english'
            : 'simba-multilingual',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate speech');
      }

      setAudioUrl(data.audioUrl || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate speech');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `speechify-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#1e293b,inset_-4px_-4px_8px_#475569]">
          <label htmlFor="tts-text" className="text-sm font-medium block mb-2">
            Enter your text
          </label>
          <textarea
            id="tts-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type what you want to say..."
            className="w-full min-h-44 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 bg-background/60"
          />
          <div className="mt-2 text-xs text-muted-foreground">{charCount} characters</div>
        </div>

        <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#1e293b,inset_-4px_-4px_8px_#475569] space-y-3">
          <label className="text-sm font-medium block">Voice ID</label>
          <input
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            placeholder="e.g. george"
            className="w-full rounded-xl border border-slate-200/60 dark:border-slate-700 px-3 py-2 bg-background/60"
          />

          <label className="text-sm font-medium block">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-slate-200/60 dark:border-slate-700 px-3 py-2 bg-background/60"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim() || !voiceId.trim()}
            className="w-full mt-2 px-4 py-2 rounded-xl text-sm font-semibold bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Generating
              </span>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      )}

      {audioUrl && (
        <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#1e293b,inset_-4px_-4px_8px_#475569]">
          <audio controls src={audioUrl} className="w-full" />
          <div className="mt-3">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white"
            >
              <Download className="h-4 w-4" /> Download audio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
