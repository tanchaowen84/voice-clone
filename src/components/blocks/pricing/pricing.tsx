import { PricingTable } from "@/components/pricing/pricing-table";
import { useTranslations } from "next-intl";

export default function PricingSection() {
  const t = useTranslations('HomePage.pricing');

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6 space-y-16">
        <div className="text-center">
          <h2 className="text-balance text-4xl lg:text-5xl font-semibold">
            {t('title')}
          </h2>
          <p className="mt-4">
            {t('description')}
          </p>
        </div>
        
        <PricingTable />
      </div>
    </section>
  );
}
