import CallToAction from "@/components/nsui/call-to-action";
import ContentSection from "@/components/nsui/content-2";
import FAQs from "@/components/nsui/faqs";
import FeaturesSection from "@/components/nsui/features-8";
import HeroSection from "@/components/nsui/hero-section";
import LogoCloud from "@/components/nsui/logo-cloud";
import Pricing from "@/components/nsui/pricing";
import StatsSection from "@/components/nsui/stats";
import WallOfLoveSection from "@/components/nsui/testimonials";
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
      <div className="mt-12 flex flex-col gap-16">
        <HeroSection />

        <LogoCloud />

        {/* <Features /> */}

        <FeaturesSection />

        <ContentSection />

        <Pricing />

        <FAQs />

        <WallOfLoveSection />

        <StatsSection />

        <CallToAction />
      </div>
    </>
  );
}
