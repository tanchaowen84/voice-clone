'use client';

import Script from 'next/script';

/**
 * Ahrefs Analytics
 *
 * https://ahrefs.com/
 * https://mksaas.com/docs/analytics#ahrefs
 */
export function AhrefsAnalytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const websiteId = process.env.NEXT_PUBLIC_AHREFS_WEBSITE_ID as string;
  if (!websiteId) {
    return null;
  }

  return (
    <Script
      async
      type="text/javascript"
      data-key={websiteId}
      src="https://analytics.ahrefs.com/analytics.js"
    />
  );
}
