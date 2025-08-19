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
    title: 'Free Online Voice Recorder | Real-time Waveform',
    description:
      'Free online voice recorder with real-time waveform. Record high-quality audio in browser, no login required. Export WAV instantly. Perfect for podcasters.',
    canonicalUrl: getUrlWithLocale('/tools/online-voice-recorder', locale),
  });
}

export { default } from './voice-recorder-client';
