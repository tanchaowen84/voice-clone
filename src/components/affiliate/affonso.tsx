'use client';

import { websiteConfig } from '@/config/website';
import Script from 'next/script';

/**
 * Affonso Affiliate
 *
 * https://affonso.com
 */
export default function AffonsoScript() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  if (!websiteConfig.features.enableAffonsoAffiliate) {
    return null;
  }

  const affiliateId = process.env.NEXT_PUBLIC_AFFILIATE_AFFONSO_ID as string;
  if (!affiliateId) {
    return null;
  }

  return (
    <Script
      src="https://affonso.io/js/pixel.min.js"
      strategy="afterInteractive"
      data-affonso={affiliateId}
      data-cookie_duration="30"
    />
  );
}
