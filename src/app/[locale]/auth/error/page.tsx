import { ErrorCard } from '@/components/auth/error-card';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrlWithLocale } from '@/lib/urls/urls';
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
  const pt = await getTranslations({locale, namespace: 'AuthPage.error'});
  
  return constructMetadata({
    title: pt('title') + ' | ' + t('title'),
    description: t('description'),
    canonicalUrl: `${getBaseUrlWithLocale(locale)}/auth/error`,
  });
}

export default async function AuthErrorPage() {
  return <ErrorCard />;
}
