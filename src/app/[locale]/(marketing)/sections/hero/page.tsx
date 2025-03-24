import HeroSection from '@/components/sections/hero/hero-section';
import HeroSection2 from '@/components/sections/hero/hero-section-2';
import HeroSection3 from '@/components/sections/hero/hero-section-3';
import HeroSection4 from '@/components/sections/hero/hero-section-4';
import { Locale } from 'next-intl';

interface HeroPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * https://nsui.irung.me/hero-section
 */
export default async function HeroPage(props: HeroPageProps) {
  const params = await props.params;

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <HeroSection />

        <HeroSection2 />

        <HeroSection3 />

        <HeroSection4 />
      </div>
    </>
  );
}
