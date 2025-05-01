import { HeaderSection } from '@/components/layout/header-section';
import { PricingTable } from '@/components/pricing/pricing-table';
import { useTranslations } from 'next-intl';

export default function PricingSection() {
  const t = useTranslations('HomePage.pricing');

  return (
    <section id="pricing" className="px-4 py-16">
      <div className="mx-auto max-w-6xl px-6 space-y-16">
        <HeaderSection
          subtitle={t('subtitle')}
          subtitleAs="h2"
          subtitleClassName="text-4xl font-bold"
          description={t('description')}
          descriptionAs="p"
        />

        <PricingTable />
      </div>
    </section>
  );
}
