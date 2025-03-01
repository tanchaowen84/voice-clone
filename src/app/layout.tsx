import { PropsWithChildren } from 'react';
import { fontSourceSans, fontSourceSerif4 } from "@/assets/fonts";
import { cn } from "@/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: PropsWithChildren) {
  // Root layout must include html and body tags
  // But keep them as minimal as possible since the actual styling
  // and content will be handled by the [locale] layout
  return (
    <html suppressHydrationWarning>
      <body className={cn(
        "size-full antialiased",
        GeistSans.className,
        fontSourceSerif4.variable,
        fontSourceSans.variable,
        GeistSans.variable,
        GeistMono.variable,
      )}>
        {children}
      </body>
    </html>
  );
}
