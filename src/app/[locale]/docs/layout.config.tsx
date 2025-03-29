import { ThemeSwitcher } from '@/components/layout/theme-switcher';
import { Logo } from '@/components/logo';
import { websiteConfig } from '@/config';
import { defaultMessages } from '@/i18n/messages';
import { docsI18nConfig } from '@/lib/docs/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Docs layout configurations
 *
 * https://fumadocs.vercel.app/docs/ui/layouts/docs
 */
export const baseOptions: BaseLayoutProps = {
  i18n: docsI18nConfig,
  githubUrl: websiteConfig.social.github ?? undefined,
  nav: {
    title: (
      <>
        <Logo className="size-6" />
        {defaultMessages.Metadata.name}
      </>
    ),
  },
  links: [
    {
      text: 'Homepage',
      url: '/',
      active: 'nested-url',
    }
  ],
  themeSwitch: {
    enabled: true,
    mode: 'light-dark-system',
    component: <ThemeSwitcher />
  },
};
