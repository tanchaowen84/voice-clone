'use client';

import { LoginForm } from '@/components/auth/login-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLocaleRouter } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { useEffect, useState } from 'react';

interface LoginWrapperProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
  callbackUrl?: string;
}

export const LoginWrapper = ({
  children,
  mode = 'redirect',
  asChild,
  callbackUrl,
}: LoginWrapperProps) => {
  const router = useLocaleRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    // append callbackUrl as a query parameter if provided
    const loginPath = callbackUrl
      ? `${Routes.Login}?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : `${Routes.Login}`;
    console.log('login wrapper, loginPath', loginPath);
    router.push(loginPath);
  };

  // this is to prevent the login wrapper from being rendered on the server side
  // and causing a hydration error
  if (!mounted) {
    return null;
  }

  if (mode === 'modal') {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-0">
          <DialogHeader className="hidden">
            <DialogTitle />
          </DialogHeader>
          <LoginForm callbackUrl={callbackUrl} className="border-none" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={handleLogin} className="cursor-pointer">
      {children}
    </span>
  );
};
