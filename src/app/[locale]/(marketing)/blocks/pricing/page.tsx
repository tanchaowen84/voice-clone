import Pricing3 from "@/components/blocks/pricing/pricing-3";
import Pricing4 from "@/components/blocks/pricing/pricing-4";
import Pricing5 from "@/components/blocks/pricing/pricing-5";
import PricingComparator from "@/components/pricing-comparator";
import { getTranslations } from 'next-intl/server';

interface PricingPageProps {
  params: Promise<{ locale: string }>;
};

/**
 * https://nsui.irung.me/pricing
 */
export default async function PricingPage(props: PricingPageProps) {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations('PricingPage');

  return (
    <>
      <div className="mt-8 flex flex-col gap-16 pb-16">
        <Pricing5 />

        <Pricing4 />

        <Pricing3 />

        <PricingComparator />
      </div>
    </>
  );
}
