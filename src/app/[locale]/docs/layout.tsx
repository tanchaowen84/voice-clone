import { XTwitterIcon } from '@/components/icons/x';
import { Logo } from '@/components/layout/logo';
import { ModeSwitcher } from '@/components/layout/mode-switcher';
import { websiteConfig } from '@/config/website';
import { docsI18nConfig } from '@/lib/docs/i18n';
import { source } from '@/lib/docs/source';
import { getUrlWithLocale } from '@/lib/urls/urls';
import { I18nProvider, Translations } from 'fumadocs-ui/i18n';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookIcon, HomeIcon } from 'lucide-react';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import '@/styles/mdx.css';

// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = Object.entries(websiteConfig.i18n.locales).map(([locale, data]) => ({
  name: data.name,
  locale,
}));

interface DocsLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}

/**
 * 1. Configure navigation
 * https://fumadocs.vercel.app/docs/ui/navigation/links
 * https://fumadocs.vercel.app/docs/ui/navigation/sidebar
 * 
 * ref:
 * https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/app/layout.config.tsx
 * 
 * 2. Organizing Pages
 * https://fumadocs.vercel.app/docs/ui/page-conventions
 * 
 * ref:
 * https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/content/docs/ui/meta.json
 */
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
  const docsOptions: BaseLayoutProps = {
    i18n: docsI18nConfig,
    githubUrl: websiteConfig.metadata.social.github ?? undefined,
    nav: {
      url: getUrlWithLocale('/docs', locale),
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
        url: getUrlWithLocale('/', locale),
        icon: <HomeIcon />,
        active: 'none',
        external: false,
      },
      {
        text: t('blog'),
        url: getUrlWithLocale('/blog', locale),
        icon: <BookIcon />,
        active: 'none',
        external: false,
      },
      ...(websiteConfig.metadata.social.twitter
        ? [
          {
            type: "icon" as const,
            icon: <XTwitterIcon />,
            text: "X",
            url: websiteConfig.metadata.social.twitter,
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
      <DocsLayout tree={source.pageTree[locale]} {...docsOptions}>
        {children}
      </DocsLayout>
    </I18nProvider>
  );
}
