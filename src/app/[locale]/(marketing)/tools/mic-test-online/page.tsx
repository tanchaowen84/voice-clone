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
    description: 'Test your microphone online instantly. Check mic volume, audio quality, and device compatibility. No download required - works in all browsers.',
    canonicalUrl: getUrlWithLocale('/tools/mic-test-online', locale),
  });
}

export { default } from './mic-test-client';
