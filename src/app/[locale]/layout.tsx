import { fontBricolageGrotesque, fontDMMono, fontDMSans, fontDMSerifDisplay, fontDMSerifText } from '@/assets/fonts';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { Providers } from './providers';

import '@/styles/globals.css';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}

/**
 * 1. Locale Layout
 * https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#layout
 *
 * 2. NextIntlClientProvider
 * https://next-intl.dev/docs/usage/configuration#nextintlclientprovider
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'size-full antialiased',
          fontBricolageGrotesque.className,
          fontDMSans.variable,
          fontDMMono.variable,
          fontDMSerifText.variable,
          fontBricolageGrotesque.variable
        )}
      >
        <NextIntlClientProvider>
          <Providers>
            {children}

            <Toaster richColors position="top-right" offset={64} />

            {/* <TailwindIndicator /> */}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
