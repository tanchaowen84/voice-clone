'use client';

import { create } from 'zustand';

interface TextToSpeechState {
  generatedAudioUrl: string | null;
  pendingAudioUrl: string | null;
  isGenerating: boolean;
  error: string | null;
  setGeneratedAudioUrl: (url: string | null) => void;
  setPendingAudioUrl: (url: string | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  clearAudio: () => void;
  revealPendingAudio: () => void;
  reset: () => void;
}

export const useTextToSpeechStore = create<TextToSpeechState>((set, get) => ({
  generatedAudioUrl: null,
  pendingAudioUrl: null,
  isGenerating: false,
  error: null,
  setGeneratedAudioUrl: (url) => {
    set({ generatedAudioUrl: url });
  },
  setPendingAudioUrl: (url) => {
    set({ pendingAudioUrl: url });
  },
  setIsGenerating: (isGenerating) => {
    set({ isGenerating });
  },
  setError: (error) => {
    set({ error });
  },
  clearAudio: () => {
    set({
      generatedAudioUrl: null,
      pendingAudioUrl: null,
    });
  },
  revealPendingAudio: () => {
    const state = get();

    if (!state.pendingAudioUrl) {
      return;
    }

    set({
      generatedAudioUrl: state.pendingAudioUrl,
      pendingAudioUrl: null,
    });
  },
  reset: () => {
    set({
      generatedAudioUrl: null,
      pendingAudioUrl: null,
      isGenerating: false,
      error: null,
    });
  },
}));
