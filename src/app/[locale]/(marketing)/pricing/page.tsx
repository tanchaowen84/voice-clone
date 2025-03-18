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
          
          <div className="mt-16 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium text-lg mb-2">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the start of your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">
                  Do you offer a free trial?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, we offer a free trial for all our subscription plans. You won't be charged until your trial period ends, and you can cancel anytime.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">
                  How does billing work?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  For subscription plans, you'll be billed monthly or yearly depending on your selection. For lifetime access, you'll be charged a one-time fee and never have to pay again.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">
                  Can I cancel my subscription?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, you can cancel your subscription at any time from your account settings. After cancellation, your plan will remain active until the end of your current billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
