"use client";

import Script from "next/script";

/**
 * Plausible Analytics
 *
 * https://plausible.io
 */
export function PlausibleAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN as string;
  if (!domain) {
    return null;
  }

  const script = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT as string;
  if (!script) {
    return null;
  }

  return (
    <Script
      defer
      type="text/javascript"
      data-domain={domain}
      src={script}
    />
  );
}
