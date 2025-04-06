import { HeaderSection } from '@/components/layout/header-section';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrlWithLocale } from '@/lib/urls/urls';
import { getAllPlans } from '@/payment';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

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

export default async function PricingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('PricingPage');

  // Get all plans as an array
  const plans = getAllPlans();

  return (
    <div className="mb-16">
      <div className="mt-8 w-full flex flex-col items-center justify-center gap-8">
        <HeaderSection
          titleAs="h2"
          title={t('title')}
          subtitle={t('subtitle')}
        />
      </div>

      {children}
    </div>
  );
}
