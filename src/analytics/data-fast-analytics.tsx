'use client';

import Script from 'next/script';

/**
 * DataFast Analytics
 *
 * https://datafa.st
 * https://mksaas.com/docs/analytics#datafast
 */
export default function DataFastAnalytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const domain = process.env.NEXT_PUBLIC_DATAFAST_DOMAIN;
  if (!domain) {
    return null;
  }

  const websiteId = process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID;
  if (!websiteId) {
    return null;
  }

  return (
    <>
      <Script
        defer
        data-website-id={websiteId}
        data-domain={domain}
        src="https://datafa.st/js/script.js"
      />
    </>
  );
}
