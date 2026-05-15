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
    title: 'Free Online Voice Recorder | Record WAV Voice Samples',
    description:
      'Record voice online in your browser with waveform preview, no signup, and WAV/WebM export. Capture podcasts, memos, or a clean voice sample for voice cloning.',
    canonicalUrl: getUrlWithLocale('/tools/online-voice-recorder', locale),
  });
}

import VoiceRecorderClient from './voice-recorder-client';

export default function OnlineVoiceRecorderPage() {
  return (
    <>
      <AdsenseScript />
      <VoiceRecorderClient />
      <BackToHomeCTA
        title="Turn a Clean Recording into a Voice Clone"
        description="Download a short voice sample, then continue to the Voice Clone workflow to generate speech with your own voice."
        buttonText="Open Voice Clone"
      />
    </>
  );
}
