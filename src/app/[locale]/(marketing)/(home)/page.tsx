import { AiCapabilitiesSection } from '@/components/blocks/ai-capabilities';
import CallToActionSection from '@/components/blocks/calltoaction/calltoaction';
import { ComparisonSection } from '@/components/blocks/comparison';
import { DemoSection } from '@/components/blocks/demo';
import FaqSection from '@/components/blocks/faqs/faqs';
import FeaturesSection from '@/components/blocks/features/features';
import HeroSection from '@/components/blocks/hero/hero';
import { HowItWorksSection } from '@/components/blocks/how-it-works';
import PricingSection from '@/components/blocks/pricing/pricing';
import { UseCasesSection } from '@/components/blocks/use-cases';
import { JsonLd } from '@/components/seo/json-ld';

import AdsenseScript from '@/components/ads/adsense';
import { getAssetUrl } from '@/config/cdn-config';
import { defaultMessages } from '@/i18n/messages';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

/**
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#metadata-api
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    canonicalUrl: getUrlWithLocale('', locale),
  });
}

function getHomePageJsonLd(locale: Locale) {
  const pageUrl = getUrlWithLocale('', locale);
  const brandName = defaultMessages.Metadata.name;
  const logoUrl = getAssetUrl('logoLight', true);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: brandName,
        url: pageUrl,
      },
      {
        '@type': 'Organization',
        name: brandName,
        url: pageUrl,
        logo: logoUrl,
      },
    ],
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const jsonLd = getHomePageJsonLd(locale);

  return (
    <>
      <JsonLd data={jsonLd} />
      <AdsenseScript />
      <div className="flex flex-col">
        <HeroSection />

        <DemoSection />

        <UseCasesSection />

        <FeaturesSection />

        <HowItWorksSection />

        <AiCapabilitiesSection />

        <ComparisonSection />

        <PricingSection />

        <FaqSection />

        <CallToActionSection />
      </div>
    </>
  );
}
