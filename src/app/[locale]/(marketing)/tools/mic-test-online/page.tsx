import AdsenseScript from '@/components/ads/adsense';
import { JsonLd } from '@/components/seo/json-ld';
import { BackToHomeCTA } from '@/components/shared/back-to-home-cta';
import seoContent from '@/content/tools/mic-test-online.en.json';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import MicTestClient from './mic-test-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;

  return constructMetadata({
    title: 'Mic Test Online - Check Your Microphone | Voice Clone',
    description:
      'Use this mic test online to check input, volume, browser permission, and playback before calls or recordings. No download, signup, or upload required.',
    canonicalUrl: getUrlWithLocale('/tools/mic-test-online', locale),
  });
}

function getMicTestJsonLd(locale: Locale) {
  const pageUrl = getUrlWithLocale('/tools/mic-test-online', locale);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Mic Test Online',
        url: pageUrl,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web browser',
        description: seoContent.hero.description,
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
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export default async function MicTestPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd data={getMicTestJsonLd(locale)} />
      <AdsenseScript />
      <MicTestClient />
      <BackToHomeCTA
        title="Test More Audio Equipment"
        description="Use our other professional audio tools to enhance your recording setup and content quality."
      />
    </>
  );
}
