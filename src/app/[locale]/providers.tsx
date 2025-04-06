'use client';

import { ActiveThemeProvider } from '@/components/layout/active-theme';
import { SubscriptionProvider } from '@/components/providers/subscription-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RootProvider } from 'fumadocs-ui/provider';
import { ThemeProvider, useTheme } from 'next-themes';
import { PropsWithChildren } from 'react';

/**
 * Providers
 * 
 * This component is used to wrap the app in the providers.
 * 
 * - ThemeProvider: Provides the theme to the app.
 * - ActiveThemeProvider: Provides the active theme to the app.
 * - RootProvider: Provides the root provider for Fumadocs UI.
 * - TooltipProvider: Provides the tooltip to the app.
 * - SubscriptionProvider: Provides the subscription state to the app.
 */
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
          <TooltipProvider>
            <SubscriptionProvider>
              {children}
            </SubscriptionProvider>
          </TooltipProvider>
        </RootProvider>
      </ActiveThemeProvider>
    </ThemeProvider>
  );
}
