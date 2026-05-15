import AdsenseScript from '@/components/ads/adsense';
import { JsonLd } from '@/components/seo/json-ld';
import { BackToHomeCTA } from '@/components/shared/back-to-home-cta';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import EchoRemoverClient from './echo-remover-client';

const echoRemoverFaq = [
  {
    q: 'Is this a free echo remover from audio?',
    a: 'Yes. You can upload a supported audio file and remove moderate room echo or reverb online without creating an account.',
  },
  {
    q: 'Can it remove echo and reverb from podcast or video audio?',
    a: 'Yes, it is built for speech-heavy recordings like podcasts, interviews, voiceovers, webinars, and extracted video audio where the main voice is still clear.',
  },
  {
    q: 'What file formats are supported?',
    a: 'The uploader accepts common audio formats including MP3, WAV, FLAC, and OGG, with a maximum file size of 50MB.',
  },
  {
    q: 'Will it remove background noise too?',
    a: 'This page focuses on echo and room reverb. For hiss, hum, fan noise, or mixed cleanup, try the audio enhancer as a separate pass.',
  },
  {
    q: 'Can I use it for music?',
    a: 'It is optimized for speech and vocal content. It may help simple music recordings, but complex music restoration is better handled in a DAW.',
  },
];

function getEchoRemoverJsonLd(locale: Locale) {
  const pageUrl = getUrlWithLocale('/tools/echo-remover-ai', locale);
  const toolsUrl = getUrlWithLocale('/tools', locale);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Free Echo Remover from Audio',
        url: pageUrl,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        description:
          'Free online echo remover for reducing room echo and reverb from speech audio, podcasts, interviews, and voice recordings.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Remove echo from audio online',
          'Reduce room reverb in voice recordings',
          'Supports MP3, WAV, FLAC, and OGG audio',
          'No account required',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: echoRemoverFaq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Tools',
            item: toolsUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Echo Remover AI',
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;

  return constructMetadata({
    title: 'Free Echo Remover from Audio - Remove Echo Online',
    description:
      'Remove echo from audio online with a free AI echo remover. Upload MP3, WAV, FLAC, or OGG to reduce room echo and reverb for podcasts, videos, and interviews.',
    canonicalUrl: getUrlWithLocale('/tools/echo-remover-ai', locale),
  });
}

export default async function EchoRemoverPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const jsonLd = getEchoRemoverJsonLd(locale);

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdsenseScript />
      <EchoRemoverClient />
      <BackToHomeCTA
        title="Remove Echo from More Audio"
        description="Explore our complete suite of AI audio tools for professional content creation."
      />
    </>
  );
}
