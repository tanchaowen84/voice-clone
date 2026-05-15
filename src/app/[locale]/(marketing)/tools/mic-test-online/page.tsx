import AdsenseScript from '@/components/ads/adsense';
import { JsonLd } from '@/components/seo/json-ld';
import { BackToHomeCTA } from '@/components/shared/back-to-home-cta';
import seoContent from '@/content/tools/mic-test-online.en.json';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

const MIC_TEST_TITLE = 'Mic Test Online: Check Microphone & Headset Free';
const MIC_TEST_DESCRIPTION =
  'Check your microphone or headset mic online with live volume, waveform, and playback. Free browser mic test, no download or login required.';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;

  return constructMetadata({
    title: MIC_TEST_TITLE,
    description: MIC_TEST_DESCRIPTION,
    canonicalUrl: getUrlWithLocale('/tools/mic-test-online', locale),
  });
}

import MicTestClient from './mic-test-client';

function getMicTestJsonLd(locale: Locale) {
  const pageUrl = getUrlWithLocale('/tools/mic-test-online', locale);
  const toolsUrl = getUrlWithLocale('/tools', locale);
  const homeUrl = getUrlWithLocale('', locale);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Mic Test Online',
        url: pageUrl,
        description: MIC_TEST_DESCRIPTION,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web browser',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Microphone permission check',
          'Live volume meter',
          'Realtime waveform',
          'Short recording playback',
          'Headset and headphone mic test',
        ],
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
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: toolsUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Mic Test Online',
            item: pageUrl,
          },
        ],
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
  const jsonLd = getMicTestJsonLd(locale);

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdsenseScript />
      <MicTestClient />
      <BackToHomeCTA
        title="Test More Audio Equipment"
        description="Use our other professional audio tools to enhance your recording setup and content quality."
      />
    </>
  );
}
