'use client';

import * as React from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PropsWithChildren } from 'react';
import { ActiveThemeProvider } from '@/components/layout/active-theme';
import { RootProvider } from 'fumadocs-ui/provider';

export function Providers({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ActiveThemeProvider>
        <RootProvider theme={theme}>
          <TooltipProvider>{children}</TooltipProvider>
        </RootProvider>
      </ActiveThemeProvider>
    </ThemeProvider>
  );
}
