import { PropsWithChildren } from 'react';
import { fontSourceSans, fontSourceSerif4 } from "@/assets/fonts";
import { cn } from "@/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

/**
 * 1. Root layout must include html and body tags.
 * 2. We can't directly access the locale here.
 * 3. The locale layout will set the correct lang attribute on the html element
 * via data attributes (@/components/layout/lang-attribute-setter.tsx).
 */
export default function RootLayout({ children }: PropsWithChildren) {
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
