import CallToActionSection from '@/components/blocks/calltoaction/calltoaction';
import FaqSection from '@/components/blocks/faqs/faqs';
import FeaturesSection from '@/components/blocks/features/features';
import Features2Section from '@/components/blocks/features/features2';
import Features3Section from '@/components/blocks/features/features3';
import Features4Section from '@/components/blocks/features/features4';
import Features5Section from '@/components/blocks/features/features5';
import HeroSection from '@/components/blocks/hero/hero';
import IntegrationSection from '@/components/blocks/integration/integration';
import Integration2Section from '@/components/blocks/integration/integration2';
import LogoCloud from '@/components/blocks/logo-cloud/logo-cloud';
import PricingSection from '@/components/blocks/pricing/pricing';
import StatsSection from '@/components/blocks/stats/stats';
import TestimonialsSection from '@/components/blocks/testimonials/testimonials';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
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
    canonicalUrl: getUrlWithLocale('/', locale),
  });
}

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage(props: HomePageProps) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations('HomePage');

  return (
    <>
      <div className="flex flex-col">
        <div id="hero">
          <HeroSection />
        </div>

        <div id="logo-cloud">
          <LogoCloud />
        </div>

        <div id="stats">
          <StatsSection />
        </div>

        <div id="integration">
          <IntegrationSection />
        </div>

        <div id="features">
          <FeaturesSection />
        </div>

        <div id="features2">
          <Features2Section />
        </div>

        <div id="features3">
          <Features3Section />
        </div>

        <div id="features4">
          <Features4Section />
        </div>

        <div id="features5">
          <Features5Section />
        </div>

        <div id="integration2">
          <Integration2Section />
        </div>

        <div id="pricing">
          <PricingSection />
        </div>

        <div id="faqs">
          <FaqSection />
        </div>

        <div id="testimonials">
          <TestimonialsSection />
        </div>

        <div id="call-to-action">
          <CallToActionSection />
        </div>
      </div>
    </>
  );
}
