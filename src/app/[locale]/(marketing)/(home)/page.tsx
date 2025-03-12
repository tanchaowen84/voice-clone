import CallToAction from '@/components/blocks/call-to-action/call-to-action';
import CallToAction3 from '@/components/blocks/call-to-action/call-to-action-3';
import Content2 from '@/components/blocks/content/content-2';
import FAQs from '@/components/blocks/faq/faqs';
import Features from '@/components/blocks/features/features';
import Features7 from '@/components/blocks/features/features-7';
import FeaturesSection from '@/components/blocks/features/features-8';
import HeroSection from '@/components/blocks/hero/hero-section-4';
import LogoCloud from '@/components/blocks/logo-cloud/logo-cloud';
import Pricing from '@/components/blocks/pricing/pricing';
import Pricing4 from '@/components/blocks/pricing/pricing-4';
import StatsSection from '@/components/blocks/stats/stats';
import Testimonials from '@/components/blocks/testimonials/testimonials';
import { getTranslations } from 'next-intl/server';

interface HomePageProps {
  params: Promise<{ locale: string }>;
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
