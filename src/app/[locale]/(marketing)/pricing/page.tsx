import Pricing3 from "@/components/nsui/pricing3";
import Pricing4 from "@/components/nsui/pricing4";
import Pricing5 from "@/components/nsui/pricing5";
import { getTranslations } from 'next-intl/server';

interface PricingPageProps {
  params: Promise<{ locale: string }>;
};

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
      </div>
    </>
  );
}
