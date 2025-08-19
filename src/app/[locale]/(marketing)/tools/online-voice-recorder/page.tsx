import seoContent from '@/../content/tools/online-voice-recorder.en.json';
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
    title: `${seoContent.hero.title} - Free Browser-Based Recording Tool`,
    description: seoContent.hero.description,
    canonicalUrl: getUrlWithLocale('/tools/online-voice-recorder', locale),
  });
}

export { default } from './voice-recorder-client';
