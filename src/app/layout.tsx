import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";
import { constructMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import {
	fontBricolageGrotesque,
	fontSourceSans,
	fontSourceSerif4,
} from "@/assets/fonts";

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

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					"min-h-screen bg-background antialiased",
					fontBricolageGrotesque.className,
					fontSourceSerif4.variable,
					fontSourceSans.variable,
					fontBricolageGrotesque.variable,
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}

					<Toaster richColors position="top-right" offset={64} />

					<TailwindIndicator />
				</ThemeProvider>
			</body>
		</html>
	);
}
