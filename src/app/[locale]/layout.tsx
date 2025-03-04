import { fontSourceSans, fontSourceSerif4 } from "@/assets/fonts";
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/marketing/navbar';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { marketingConfig } from '@/config/marketing';
import { routing } from '@/i18n/routing';
import { cn } from "@/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { Providers } from './providers';

import '@/styles/globals.css';

interface LocaleLayoutProps {
	children: ReactNode;
	params: Promise<{ locale: string }>;
};

/**
 * 1. Locale Layout
 * https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#layout
 * 
 * 2. NextIntlClientProvider
 * https://next-intl.dev/docs/usage/configuration#nextintlclientprovider
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	const { locale } = await params;

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Providing all messages to the client side
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={cn(
				"size-full antialiased",
				GeistSans.className,
				fontSourceSerif4.variable,
				fontSourceSans.variable,
				GeistSans.variable,
				GeistMono.variable,
			)}>
				<NextIntlClientProvider messages={messages}>
					<Providers>
						{children}

						<Toaster richColors position="top-right" offset={64} />

						<TailwindIndicator />
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
