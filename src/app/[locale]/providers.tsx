'use client';

import * as React from 'react';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PropsWithChildren } from 'react';
import { ActiveThemeProvider } from '@/components/layout/active-theme';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ActiveThemeProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ActiveThemeProvider>
    </ThemeProvider>
  );
}
