import { ResetPasswordForm } from '@/components/auth/reset-password-form';
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
  const pageTranslations = await getTranslations({locale, namespace: 'AuthPage.resetPassword'});
  
  return constructMetadata({
    title: pageTranslations('title') + ' | ' + t('title'),
    description: t('description'),
    canonicalUrl: `${getBaseUrlWithLocale(locale)}/auth/reset-password`,
  });
}

export default async function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
