import AdsenseScript from '@/components/ads/adsense';
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
    title: 'Audio Enhancer Free - AI Voice Enhancer Online',
    description:
      'Professional audio enhancer removes noise and echo instantly. AI voice enhancer free tool for podcasts, videos. Audio enhancer online - no login required.',
    canonicalUrl: getUrlWithLocale('/tools/audio-enhancer', locale),
  });
}

import AudioEnhancerClient from './audio-enhancer-client';

export default function AudioEnhancerPage() {
  return (
    <>
      <AdsenseScript />
      <AudioEnhancerClient />
    </>
  );
}
