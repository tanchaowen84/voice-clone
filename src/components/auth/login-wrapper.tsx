'use client';

import { LoginForm } from '@/components/auth/login-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLocalePathname, useLocaleRouter } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LoginWrapperProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

export const LoginWrapper = ({
  children,
  mode = 'redirect',
  asChild,
}: LoginWrapperProps) => {
  const router = useLocaleRouter();
  const pathname = useLocalePathname();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isTablet, isDesktop } = useMediaQuery();

  const handleLogin = () => {
    router.push(`${Routes.Login}`);
  };

  // Close the modal on route change
  useEffect(() => {
    setIsModalOpen(false);
  }, [pathname, searchParams]);

  // 1. don't open the modal if the user is already in the auth pages
  // 2. keep isTablet or isDesktop open, if user resizes the window
  if (mode === 'modal' && (isTablet || isDesktop)) {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-0">
          <DialogHeader>
            <DialogTitle />
          </DialogHeader>
          <LoginForm />
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
