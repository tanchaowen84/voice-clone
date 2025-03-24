import CallToAction from '@/components/sections/call-to-action/call-to-action';
import FAQs from '@/components/sections/faq/faqs';
import Features7 from '@/components/sections/features/features-7';
import HeroSection from '@/components/sections/hero/hero-section-4';
import LogoCloud from '@/components/sections/logo-cloud/logo-cloud';
import Pricing4 from '@/components/sections/pricing/pricing-4';
import StatsSection from '@/components/sections/stats/stats';
import Testimonials from '@/components/sections/testimonials/testimonials';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrlWithLocale } from '@/lib/urls/get-base-url';
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
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  
  return constructMetadata({
    title: t('title'),
    description: t('description'),
    canonicalUrl: `${getBaseUrlWithLocale(locale)}`,
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
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <div id="hero" className="">
          <HeroSection />
        </div>

        <div id="logo-cloud" className="">
          <LogoCloud />
        </div>

        <div id="features" className="">
          <Features7 />
        </div>

        {/* <FeaturesSection /> */}

        {/* <ContentSection /> */}

        <div id="pricing" className="">
          <Pricing4 />
        </div>

        <div id="faqs" className="">
          <FAQs />
        </div>

        <div id="testimonials" className="">
          <Testimonials />
        </div>

        <div id="stats" className="">
          <StatsSection />
        </div>

        <CallToAction />
      </div>
    </>
  );
}
