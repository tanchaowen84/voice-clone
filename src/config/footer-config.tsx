'use client';

import { Routes } from '@/routes';
import type { NestedMenuItem } from '@/types';
import { useTranslations } from 'next-intl';

/**
 * Get footer config with translations
 *
 * NOTICE: used in client components only
 *
 * docs:
 * https://mksaas.com/docs/config/footer
 *
 * @returns The footer config with translated titles
 */
export function getFooterLinks(): NestedMenuItem[] {
  const t = useTranslations('Marketing.footer');

  return [
    {
      title: t('product.title'),
      items: [
        {
          title: t('product.items.features'),
          href: Routes.Features,
          external: false,
        },
        {
          title: t('product.items.pricing'),
          href: Routes.Pricing,
          external: false,
        },
        {
          title: t('product.items.faq'),
          href: Routes.FAQ,
          external: false,
        },
      ],
    },
    {
      title: t('resources.title'),
      items: [
        {
          title: t('resources.items.blog'),
          href: Routes.Blog,
          external: false,
        },
      ],
    },
    {
      title: t('tools.title'),
      items: [
        {
          title: t('tools.items.audioEnhancer'),
          href: Routes.ToolsAudioEnhancer,
          external: false,
        },
        {
          title: t('tools.items.echoRemover'),
          href: Routes.ToolsEchoRemover,
          external: false,
        },
        {
          title: t('tools.items.voiceRecorder'),
          href: Routes.ToolsVoiceRecorder,
          external: false,
        },
        {
          title: t('tools.items.micTest'),
          href: Routes.ToolsMicTest,
          external: false,
        },
      ],
    },

    {
      title: t('legal.title'),
      items: [
        {
          title: t('legal.items.cookiePolicy'),
          href: Routes.CookiePolicy,
          external: false,
        },
        {
          title: t('legal.items.privacyPolicy'),
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: t('legal.items.termsOfService'),
          href: Routes.TermsOfService,
          external: false,
        },
      ],
    },
    {
      title: t('friends.title'),
      items: [
        {
          title: t('friends.items.veriia'),
          href: 'https://detectordeia.pro',
          external: true,
        },
      ],
    },
  ];
}
