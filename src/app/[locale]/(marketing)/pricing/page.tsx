import { constructMetadata } from '@/lib/metadata';
import { getBaseUrlWithLocale } from '@/lib/urls/get-base-url';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { getAllPlans } from '@/payment';
import { PricingTable } from '@/components/payment/pricing-table';
import Container from '@/components/container';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const pt = await getTranslations({ locale, namespace: 'PricingPage' });
  return constructMetadata({
    title: pt('title') + ' | ' + t('title'),
    description: pt('description'),
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

  // Get all plans as an array
  const plans = getAllPlans();

  return (
    <Container>
      <div className="mt-8 flex flex-col gap-16 pb-16 px-4">
        <div className="py-12 w-full">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mx-auto">
              Choose the plan that works best for you. All plans include core features, unlimited updates, and email support.
            </p>
          </div>

          <PricingTable plans={plans} />
          
        </div>
      </div>
    </Container>
  );
}
