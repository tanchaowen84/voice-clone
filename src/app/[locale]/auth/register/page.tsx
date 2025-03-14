import { RegisterForm } from '@/components/auth/register-form';
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
  const pageTranslations = await getTranslations({locale, namespace: 'AuthPage.register'});
  
  return constructMetadata({
    title: pageTranslations('title') + ' | ' + t('title'),
    description: t('description'),
    canonicalUrl: `${getBaseUrlWithLocale(locale)}/auth/register`,
  });
}

export default async function RegisterPage() {
  return <RegisterForm />;
}
