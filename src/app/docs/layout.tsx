import { baseOptions } from '@/app/docs/layout.config';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';
import { fontDMSans } from '@/assets/fonts';

import '@/styles/docs.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontDMSans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <DocsLayout tree={source.pageTree} {...baseOptions}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
