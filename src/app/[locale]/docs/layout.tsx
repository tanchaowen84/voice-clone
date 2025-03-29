import { baseOptions } from '@/app/[locale]/docs/layout.config';
import { source } from '@/lib/docs/source';
import { Translations } from 'fumadocs-ui/i18n';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { Locale } from 'next-intl';
import type { ReactNode } from 'react';
import { DocsProviders } from './providers-docs';
import { I18nProvider } from 'fumadocs-ui/i18n';
import { LOCALE_LIST } from '@/i18n/routing';

import '@/styles/docs.css';

const zhTranslations: Partial<Translations> = {
  toc: '目录',
  search: '搜索文档',
  lastUpdate: '最后更新于',
  searchNoResult: '没有结果',
  previousPage: '上一页',
  nextPage: '下一页',
  chooseLanguage: '选择语言',
};

const enTranslations: Partial<Translations> = {
  toc: 'Table of Contents',
  search: 'Search docs',
  lastUpdate: 'Last updated on',
  searchNoResult: 'No results',
  previousPage: 'Previous',
  nextPage: 'Next',
  chooseLanguage: 'Select language',
};

// Map of locale to translations
const translations: Record<string, Partial<Translations>> = {
  zh: zhTranslations,
  en: enTranslations,
};

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

  return (
    <DocsProviders>
      <I18nProvider 
        locales={locales} 
        locale={locale} 
        translations={translations[locale] || enTranslations}
      >
        <DocsLayout tree={source.pageTree[locale]} {...baseOptions}>
          {children}
        </DocsLayout>
      </I18nProvider>
    </DocsProviders>
  );
}
