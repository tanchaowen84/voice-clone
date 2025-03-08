import CallToAction3 from "@/components/blocks/call-to-action/call-to-action-3";
import Content2 from "@/components/blocks/content/content-2";
import FAQs from "@/components/blocks/faq/faqs";
import FeaturesSection from "@/components/blocks/features/features-8";
import HeroSection from "@/components/blocks/hero/hero-section";
import LogoCloud from "@/components/blocks/logo-cloud/logo-cloud";
import Pricing from "@/components/blocks/pricing/pricing";
import StatsSection from "@/components/blocks/stats/stats";
import { getTranslations } from 'next-intl/server';

interface HomePageProps {
  params: Promise<{ locale: string }>;
};

export default async function HomePage(props: HomePageProps) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations('HomePage');

  return (
    <>
      <div className="mt-8 flex flex-col gap-16">
        <HeroSection />

        <LogoCloud />

        {/* <Features /> */}

        {/* <FeaturesSection /> */}

        {/* <ContentSection /> */}

        <Pricing />

        {/* <FAQs />

        <WallOfLoveSection /> */}

        {/* <StatsSection />

        <CallToAction /> */}
      </div>
    </>
  );
}
