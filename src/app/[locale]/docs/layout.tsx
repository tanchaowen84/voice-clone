import { baseOptions } from '@/app/[locale]/docs/layout.config';
import { source } from '@/lib/docs/source';
import { Translations } from 'fumadocs-ui/i18n';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { Locale } from 'next-intl';
import type { ReactNode } from 'react';
import { DocsProviders } from './providers-docs';
import { I18nProvider } from 'fumadocs-ui/i18n';

import '@/styles/docs.css';

const cn: Partial<Translations> = {
  toc: '目录',
  search: '搜索文档',
  lastUpdate: '最后更新于',
  searchNoResult: '没有结果',
  previousPage: '上一页',
  nextPage: '下一页',
  chooseLanguage: '选择语言',
};

// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: 'Chinese',
    locale: 'cn',
  },
];

interface DocsLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function DocsRootLayout({ children, params }: DocsLayoutProps) {
  const { locale } = await params;

  return (
    <DocsProviders>
      <I18nProvider locales={locales} locale={locale} translations={cn}>
        <DocsLayout tree={source.pageTree[locale]} {...baseOptions}>
          {children}
        </DocsLayout>
      </I18nProvider>
    </DocsProviders>
  );
}
