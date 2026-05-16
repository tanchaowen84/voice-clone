import AdsenseScript from '@/components/ads/adsense';
import { JsonLd } from '@/components/seo/json-ld';
import { BackToHomeCTA } from '@/components/shared/back-to-home-cta';
import seoContent from '@/content/tools/audio-enhancer.en.json';
import { LocaleLink } from '@/i18n/navigation';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { Routes } from '@/routes';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import AudioEnhancerClient from './audio-enhancer-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;

  return constructMetadata({
    title: 'Audio Enhancer Free - Online Voice Enhancer | Voice Clone',
    description:
      'Use a free audio enhancer and voice enhancer to clean recordings, reduce noise and echo, and keep speech natural for podcasts, videos, and voiceovers.',
    canonicalUrl: getUrlWithLocale('/tools/audio-enhancer', locale),
  });
}

function getAudioEnhancerJsonLd(locale: Locale) {
  const pageUrl = getUrlWithLocale('/tools/audio-enhancer', locale);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: seoContent.hero.title,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: pageUrl,
        description: seoContent.hero.subtitle,
        isAccessibleForFree: true,
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

const relatedAudioLinks = [
  {
    href: Routes.ToolsEchoRemover,
    title: 'Echo Remover AI',
    description: 'Reduce room echo and reverb before publishing voice audio.',
  },
  {
    href: Routes.ToolsVoiceRecorder,
    title: 'Online Voice Recorder',
    description: 'Record a cleaner voice sample directly in the browser.',
  },
  {
    href: Routes.ToolsMicTest,
    title: 'Mic Test Online',
    description: 'Check microphone volume and input quality before recording.',
  },
  {
    href: Routes.Root,
    title: 'Voice Clone',
    description: 'Turn polished voice samples into natural text-to-speech.',
  },
];

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
      <section className="border-t bg-background">
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="related-audio-tools"
              className="text-2xl font-semibold tracking-tight"
            >
              Related Voice and Audio Tools
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Continue the same workflow with tools for recording, testing, echo
              cleanup, and voice generation.
            </p>
          </div>
          <div
            aria-labelledby="related-audio-tools"
            className="mt-6 grid gap-3 sm:grid-cols-2"
          >
            {relatedAudioLinks.map((item) => (
              <LocaleLink
                key={item.href}
                href={item.href}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {item.description}
                </span>
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>
      <BackToHomeCTA
        title="Enhance More Audio Content"
        description="Try our other AI-powered tools to create, record, and optimize your audio content."
      />
    </>
  );
}
