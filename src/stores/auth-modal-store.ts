'use client';

import { create } from 'zustand';

export type PendingAction = 'none' | 'generate';

interface AuthModalState {
  isOpen: boolean;
  pendingAction: PendingAction;
  pendingText: string | null;

  // actions
  open: () => void;
  close: () => void;
  setPending: (text: string, action?: PendingAction) => void;
  clearPending: () => void;
  loadFromStorage: () => void;

  // media persistence flags
  pendingMediaSaved?: boolean;
}

const STORAGE_KEY = 'voiceclone:pending';

export const useAuthModalStore = create<AuthModalState>((set, get) => ({
  isOpen: false,
  pendingAction: 'none',
  pendingText: null,
  pendingMediaSaved: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  setPending: (text: string, action: PendingAction = 'generate') => {
    set({ pendingText: text, pendingAction: action });
    // persist a lightweight payload for safety (in case of unexpected reload)
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ action, text, ts: Date.now() })
      );
    } catch (e) {
      // ignore
    }
  },

  clearPending: () => {
    set({ pendingText: null, pendingAction: 'none', pendingMediaSaved: false });
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  },

  loadFromStorage: () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as {
        action?: PendingAction;
        text?: string;
        ts?: number;
      };
      if (data?.text && data?.action) {
        set({ pendingText: data.text, pendingAction: data.action });
      }
    } catch (e) {
      // ignore
    }
  },
}));
