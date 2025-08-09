'use client';

import { LoginForm } from '@/components/auth/login-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth-client';
import { useAuthModalStore } from '@/stores/auth-modal-store';
import { useEffect } from 'react';

/**
 * Global Auth Modal Provider
 * - Shows login modal when store.isOpen is true
 * - Listens to authClient session changes to trigger resume logic
 */
export function AuthModalProvider() {
  const { isOpen, close } = useAuthModalStore();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (!open ? close() : undefined)}
    >
      <DialogHeader className="hidden">
        <DialogTitle />
      </DialogHeader>
      <DialogContent className="sm:max-w-[400px] p-0">
        <LoginForm className="border-none" />
      </DialogContent>
    </Dialog>
  );
}

/**
 * AuthEvents: hooks into session updates to resume pending action after login.
 */
export function AuthEvents() {
  const { pendingAction, pendingText, clearPending, loadFromStorage } =
    useAuthModalStore();
  const { data: session } = authClient.useSession();

  // Rehydrate pending state after a full reload
  useEffect(() => {
    loadFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session?.user && pendingAction === 'generate' && pendingText) {
      // Dispatch a custom event; the voice-clone page listens and resumes
      window.dispatchEvent(
        new CustomEvent('auth:login_success', {
          detail: { pendingAction, pendingText },
        })
      );
      clearPending();
    }
  }, [session, pendingAction, pendingText, clearPending]);

  return null;
}
