import AdsenseScript from '@/components/ads/adsense';
import { JsonLd } from '@/components/seo/json-ld';
import { BackToHomeCTA } from '@/components/shared/back-to-home-cta';
import seoContent from '@/content/tools/audio-enhancer.en.json';
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
    title: 'Voice Enhancer Online - Free AI Audio Enhancer',
    description:
      'Use our AI audio enhancer to clean voice recordings, reduce noise and echo, and keep speech natural for podcasts, videos, and voiceovers.',
    canonicalUrl: getUrlWithLocale('/tools/audio-enhancer', locale),
  });
}

import AudioEnhancerClient from './audio-enhancer-client';

function getAudioEnhancerJsonLd(locale: Locale) {
  const pageUrl = getUrlWithLocale('/tools/audio-enhancer', locale);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: seoContent.hero.title,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: pageUrl,
        description: seoContent.hero.subtitle,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: seoContent.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };
}

export default async function AudioEnhancerPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const jsonLd = getAudioEnhancerJsonLd(locale);

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdsenseScript />
      <AudioEnhancerClient />
      <BackToHomeCTA
        title="Enhance More Audio Content"
        description="Try our other AI-powered tools to create, record, and optimize your audio content."
      />
    </>
  );
}
