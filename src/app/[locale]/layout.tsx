import "@/app/globals.css";
import { fontSourceSans, fontSourceSerif4 } from "@/assets/fonts";
import { Toaster } from "@/components/ui/sonner";
import { routing } from '@/i18n/routing';
import { constructMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/marketing/navbar";
import { marketingConfig } from "@/config/marketing";

export const metadata: Metadata = constructMetadata();

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' }
	]
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
	children: ReactNode;
	params: Promise<{ locale: string }>;
};

/**
 * https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#layout
 */
export default async function LocaleLayout(props: LocaleLayoutProps) {
	const { children } = props;
	const params = await props.params;
	const { locale } = params;

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages();

	// TODO: body min-h-screen -> size-full, check if this is correct on mobile
	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={cn(
					"size-full antialiased",
					GeistSans.className,
					fontSourceSerif4.variable,
					fontSourceSans.variable,
					GeistSans.variable,
					GeistMono.variable,
				)}
			>
				<NextIntlClientProvider messages={messages}>
					<Providers>
						{/* {children} */}

						<div className="flex flex-col min-h-screen">
							<Navbar scroll={true} config={marketingConfig} />
							<main className="flex-1">{children}</main>
							<Footer />
						</div>

						<Toaster richColors position="top-right" offset={64} />

						<TailwindIndicator />
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
