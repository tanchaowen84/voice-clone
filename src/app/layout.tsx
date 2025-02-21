import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";
import { constructMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TailwindIndicator } from "@/components/tailwind-indicator";

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
					"min-h-screen bg-background antialiased"
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
