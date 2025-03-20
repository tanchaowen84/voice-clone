import { CustomPage } from '@/components/page/custom-page';
import { constructMetadata } from '@/lib/metadata';
import { getCustomPage } from '@/lib/page/get-custom-page';
import { getBaseUrlWithLocale } from '@/lib/urls/get-base-url';
import type { NextPageProps } from '@/types/next-page-props';
import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const {locale} = await params;
  const page = await getCustomPage('cookie-policy', locale);

  if (!page) {
    console.warn(
      `generateMetadata, page not found for cookie-policy, locale: ${locale}`
    );
    return {};
  }

  const t = await getTranslations({locale, namespace: 'Metadata'});

  return constructMetadata({
    title: page.title + ' | ' + t('title'),
    description: page.description,
    canonicalUrl: `${getBaseUrlWithLocale(locale)}/cookie-policy`,
  });
}

export default async function CookiePolicyPage(props: NextPageProps) {
  const params = await props.params;
  if (!params) {
    notFound();
  }

  const locale = params.locale as string;
  const page = await getCustomPage('cookie-policy', locale);

  if (!page) {
    notFound();
  }

  return (
    <CustomPage
      title={page.title}
      description={page.description}
      date={page.date}
      content={page.body.code}
    />
  );
}
