import HeroSection from '@/components/blocks/hero/hero';

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

export default async function HomePage() {
  return (
    <>
      <div className="flex flex-col">
        <HeroSection />

        {/* <DemoSection />

        <UseCasesSection />

        <FeaturesSection />

        <HowItWorksSection />

        <AiCapabilitiesSection />

        <ComparisonSection />

        <PricingSection />

        <FaqSection />

        <CallToActionSection /> */}
      </div>
    </>
  );
}
