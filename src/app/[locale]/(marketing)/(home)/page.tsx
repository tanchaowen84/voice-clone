import FaqSection from '@/components/blocks/faqs/faqs';
import FeaturesSection from '@/components/blocks/features/features';
import Features2Section from '@/components/blocks/features/features2';
import HeroSection from '@/components/blocks/hero/hero';
import LogoCloud from '@/components/blocks/logo-cloud/logo-cloud';
import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import CallToAction from '../../preview/call-to-action/one/page';
import ContentSection from '../../preview/content/one/page';
import Pricing from '../../preview/pricing/three/page';
import StatsSection from '../../preview/stats/one/page';
import Testimonials from '../../preview/testimonials/one/page';

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
        <div id="hero" className="">
          <HeroSection />
        </div>

        <div id="logo-cloud" className="">
          <LogoCloud />
        </div>

        <div id="features" className="">
          <FeaturesSection />
        </div>

        <div id="features2" className="">
          <Features2Section />
        </div>

        <div id="content" className="">
          <ContentSection />
        </div>

        <div id="pricing" className="">
          <Pricing />
        </div>

        <div id="faqs" className="">
          <FaqSection />
        </div>

        <div id="testimonials" className="">
          <Testimonials />
        </div>

        <div id="stats" className="">
          <StatsSection />
        </div>

        <div id="call-to-action" className="">
          <CallToAction />
        </div>
      </div>
    </>
  );
}
