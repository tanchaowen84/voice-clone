import { baseOptions } from '@/app/[locale]/docs/layout.config';
import { source } from '@/lib/docs/source';
import { Translations } from 'fumadocs-ui/i18n';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { Locale } from 'next-intl';
import type { ReactNode } from 'react';
import { DocsProviders } from './providers-docs';
import { I18nProvider } from 'fumadocs-ui/i18n';
import { LOCALE_LIST } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

import '@/styles/docs.css';

// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = Object.entries(LOCALE_LIST).map(([locale, data]) => ({
  name: data.name,
  locale,
}));

interface DocsLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function DocsRootLayout({ children, params }: DocsLayoutProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DocsPage' });

  // Create translations object for fumadocs-ui from our message files
  const translations: Partial<Translations> = {
    toc: t('toc'),
    search: t('search'),
    lastUpdate: t('lastUpdate'),
    searchNoResult: t('searchNoResult'),
    previousPage: t('previousPage'),
    nextPage: t('nextPage'),
    chooseLanguage: t('chooseLanguage'),
  };

  return (
    <DocsProviders>
      <I18nProvider 
        locales={locales} 
        locale={locale} 
        translations={translations}
      >
        <DocsLayout tree={source.pageTree[locale]} {...baseOptions}>
          {children}
        </DocsLayout>
      </I18nProvider>
    </DocsProviders>
  );
}
