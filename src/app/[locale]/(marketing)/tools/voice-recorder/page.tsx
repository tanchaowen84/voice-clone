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
    title: 'Online Voice Recorder - Free Voice Recording Tool',
    description:
      'Professional online voice recorder with real-time waveform visualization. Record, preview, and download high-quality audio recordings directly in your browser.',
    canonicalUrl: getUrlWithLocale('/tools/voice-recorder', locale),
  });
}

import VoiceRecorderClient from './voice-recorder-client';

export default function VoiceRecorderPage() {
  return (
    <>
      <AdsenseScript />
      <VoiceRecorderClient />
    </>
  );
}
