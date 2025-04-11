"use client";

import Script from "next/script";

/**
 * Umami Analytics
 *
 * https://umami.is
 */
export function UmamiAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID as string;
  if (!websiteId) {
    return null;
  }

  return (
    <Script
      async
      type="text/javascript"
      data-website-id={websiteId}
      src="https://cloud.umami.is/script.js"
    />
  );
}