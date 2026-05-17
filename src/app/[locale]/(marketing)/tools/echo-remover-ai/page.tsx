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
    q: 'Is this a free echo remover AI?',
    a: 'Yes. You can upload a supported audio file and reduce moderate room echo or reverb online without creating an account.',
  },
  {
    q: 'Can it remove echo from podcast or video audio?',
    a: 'Yes. It is built for speech-heavy recordings like podcasts, interviews, voiceovers, webinars, and extracted video audio where the main voice is still clear.',
  },
  {
    q: 'What file formats are supported?',
    a: 'The uploader accepts common audio formats including MP3, WAV, FLAC, and OGG, with a maximum file size of 50MB.',
  },
  {
    q: 'Is this also a reverb remover?',
    a: 'It can reduce room reverb and echo tails in many voice recordings, but very heavy reverb, distortion, or clipping may still need re-recording or manual editing.',
  },
  {
    q: 'Will it remove background noise too?',
    a: 'This page focuses on echo and room reverb. For hiss, hum, fan noise, or broader speech cleanup, try the audio enhancer as a separate pass.',
  },
];

function getEchoRemoverJsonLd(locale: Locale): Record<string, unknown> {
  const pageUrl = getUrlWithLocale('/tools/echo-remover-ai', locale);
  const toolsUrl = getUrlWithLocale('/tools', locale);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Echo Remover AI for Audio',
        url: pageUrl,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        description:
          'Free online echo remover AI for reducing room echo and reverb from speech audio, podcasts, interviews, videos, and voice recordings.',
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
    title: 'Echo Remover AI Free - Remove Echo from Audio Online',
    description:
      'Use a free echo remover AI to remove echo from audio online. Upload MP3, WAV, FLAC, or OGG to reduce room echo and reverb for podcasts, videos, and interviews.',
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
        title="Clean Up More Audio"
        description="Explore related audio tools for recording, testing, and improving voice content."
      />
    </>
  );
}
