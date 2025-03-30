import { Icons } from '@/components/icons/icons';
import { ModeSwitcher } from '@/components/layout/mode-switcher';
import { Logo } from '@/components/logo';
import { websiteConfig } from '@/config';
import { LOCALE_LIST } from '@/i18n/routing';
import { docsI18nConfig } from '@/lib/docs/i18n';
import { source } from '@/lib/docs/source';
import { I18nProvider, Translations } from 'fumadocs-ui/i18n';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import '@/styles/mdx.css';

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

  // Docs layout configurations
  const baseOptions: BaseLayoutProps = {
    i18n: docsI18nConfig,
    githubUrl: websiteConfig.social.github ?? undefined,
    nav: {
      title: (
        <>
          <Logo className="size-6" />
          {t('title')}
        </>
      ),
    },
    links: [
      {
        text: t('homepage'),
        url: '/',
        active: 'nested-url',
      },
      ...(websiteConfig.social.twitter
        ? [
          {
            type: "icon" as const,
            icon: <Icons.x />,
            text: "X",
            url: websiteConfig.social.twitter,
            secondary: true,
          }
        ]
        : [])
    ],
    themeSwitch: {
      enabled: true,
      mode: 'light-dark-system',
      component: <ModeSwitcher />
    },
  };

  return (
    <I18nProvider
      locales={locales}
      locale={locale}
      translations={translations}
    >
      <DocsLayout tree={source.pageTree[locale]} {...baseOptions}>
        {children}
      </DocsLayout>
    </I18nProvider>
  );
}
