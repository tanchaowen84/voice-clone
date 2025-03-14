import Pricing3 from '@/components/blocks/pricing/pricing-3';
import Pricing4 from '@/components/blocks/pricing/pricing-4';
import Pricing5 from '@/components/blocks/pricing/pricing-5';
import PricingComparator from '@/components/pricing-comparator';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrlWithLocale } from '@/lib/urls/get-base-url';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  const pageTranslations = await getTranslations({locale, namespace: 'PricingPage'});
  return constructMetadata({
    title: pageTranslations('title') + ' | ' + t('title'),
    description: pageTranslations('description'),
    canonicalUrl: `${getBaseUrlWithLocale(locale)}/pricing`,
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
