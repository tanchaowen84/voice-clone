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

export { default } from './audio-enhancer-client';
