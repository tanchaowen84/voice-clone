'use client';

import Script from 'next/script';

/**
 * Umami Analytics
 *
 * https://umami.is
 * https://mksaas.com/docs/analytics#umami
 */
export function UmamiAnalytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID as string;
  if (!websiteId) {
    return null;
  }

  const script = process.env.NEXT_PUBLIC_UMAMI_SCRIPT as string;
  if (!script) {
    return null;
  }

  return (
    <Script
      async
      type="text/javascript"
      data-website-id={websiteId}
      src={script}
    />
  );
}
