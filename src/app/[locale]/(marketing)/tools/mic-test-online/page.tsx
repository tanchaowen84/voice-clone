import AdsenseScript from '@/components/ads/adsense';
import { BackToHomeCTA } from '@/components/shared/back-to-home-cta';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;

  return constructMetadata({
    title: 'Mic Test Online | Free Microphone Test Tool',
    description:
      'Test your microphone online instantly. Check mic volume, audio quality, and device compatibility. No download required - works in all browsers.',
    canonicalUrl: getUrlWithLocale('/tools/mic-test-online', locale),
  });
}

import MicTestClient from './mic-test-client';

export default function MicTestPage() {
  return (
    <>
      <AdsenseScript />
      <MicTestClient />
      <BackToHomeCTA
        title="Test More Audio Equipment"
        description="Use our other professional audio tools to enhance your recording setup and content quality."
      />
    </>
  );
}
