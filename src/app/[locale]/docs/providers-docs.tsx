'use client';

import { RootProvider } from 'fumadocs-ui/provider';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

interface DocsProvidersProps {
  children: ReactNode;
}

/***
 * Docs Configuration
 * 
 * https://fumadocs.vercel.app/docs/ui/theme#lightdark-modes
 */
export function DocsProviders({ children }: DocsProvidersProps) {
  const theme = useTheme();

  return (
    <RootProvider theme={theme}>
      {children}
    </RootProvider>
  );
}
