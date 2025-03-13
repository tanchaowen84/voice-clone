import Pricing3 from '@/components/blocks/pricing/pricing-3';
import Pricing4 from '@/components/blocks/pricing/pricing-4';
import Pricing5 from '@/components/blocks/pricing/pricing-5';
import PricingComparator from '@/components/pricing-comparator';
import { constructMetadata } from '@/lib/metadata';
import { createTitle } from '@/lib/utils';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('PricingPage');

  return constructMetadata({
    title: createTitle(t('title')),
    description: t('description'),
  });
}

interface PricingPageProps {
  params: Promise<{ locale: Locale }>;
}

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
