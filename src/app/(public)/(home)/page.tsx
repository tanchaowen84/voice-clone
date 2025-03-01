// import PromotekitScript from "@/components/affiliate/promotekit-stripe-checkout";
// import { HomeCallToAction } from "@/components/home/home-cta";
// import { HomeFAQ } from "@/components/home/home-faq";
// import HomeFeatures from "@/components/home/home-features";
// import { HomeFeaturesHeader } from "@/components/home/home-features-header";
// import { HomeFeaturesMore } from "@/components/home/home-features-more";
// import HomeHero from "@/components/home/home-hero";
// import { HomeHowItWorks } from "@/components/home/home-how-it-works";
// import { HomeIntroduction } from "@/components/home/home-introduction";
// import HomeMonetization from "@/components/home/home-monetization";
// import { HomeNewsletter } from "@/components/home/home-newsletter";
// import HomePowered from "@/components/home/home-powered";
// import HomePricing from "@/components/home/home-pricing";
// import { HomeShowcase } from "@/components/home/home-showcase";
// import { HomeTestimonials } from "@/components/home/home-testimonials";
// import HomeVideo from "@/components/home/home-video";
import CallToAction from "@/components/nsui/call-to-action";
import ContentSection from "@/components/nsui/content-2";
import FAQs from "@/components/nsui/faqs";
import Features from "@/components/nsui/features-2";
import FeaturesSection from "@/components/nsui/features-8";
import HeroSection from "@/components/nsui/hero-section";
import LogoCloud from "@/components/nsui/logo-cloud";
import Pricing from "@/components/nsui/pricing";
import StatsSection from "@/components/nsui/stats";
import WallOfLoveSection from "@/components/nsui/testimonials";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function HomePage() {
  return (
    <>
      {/* <PromotekitScript /> */}

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

        {/* <HomeHero /> */}

        {/* <HomeVideo /> */}

        {/* <HomePowered /> */}

        {/* <HomeMonetization /> */}

        {/* <HomeHowItWorks /> */}

        {/* <HomeFeaturesHeader /> */}

        {/* <HomeFeatures /> */}

        {/* <HomeFeaturesMore /> */}

        {/* <HomePricing /> */}

        {/* <HomeFAQ /> */}

        {/* <HomeIntroduction /> */}

        {/* <HomeTestimonials /> */}

        {/* <HomeCallToAction /> */}

        {/* <HomeShowcase /> */}

        {/* <HomeNewsletter /> */}
      </div>
    </>
  );
}
