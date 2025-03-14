import { Card } from '@/components/ui/card';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrlWithLocale } from '@/lib/urls/get-base-url';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ContactForm } from './contact-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  const pageTranslations = await getTranslations({locale, namespace: 'ContactPage'});
  
  return constructMetadata({
    title: pageTranslations('title') + ' | ' + t('title'),
    description: pageTranslations('description'),
    canonicalUrl: `${getBaseUrlWithLocale(locale)}/contact`,
  });
}

/**
 * inspired by https://nsui.irung.me/contact
 */
export default async function ContactPage() {
  const t = await getTranslations('ContactPage');

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Form */}
      <Card className="mx-auto max-w-lg p-8 shadow-md">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('formDescription')}
          </p>
        </div>

        <ContactForm labels={{
          name: t('name'),
          email: t('email'),
          message: t('message'),
          submit: t('submit')
        }} />
      </Card>
    </div>
  );
}
