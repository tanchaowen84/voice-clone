'use client';

import { Routes } from '@/routes';
import { NestedMenuItem } from '@/types';
import { useTranslations } from 'next-intl';

/**
 * Get footer config with translations
 * 
 * NOTICE: used in client components only
 *
 * @returns The footer config with translated titles
 */
export function getFooterConfig(): NestedMenuItem[] {
  const t = useTranslations();

  return [
    {
      title: t('Marketing.footer.product.title'),
      items: [
        {
          title: t('Marketing.footer.product.items.features'),
          href: Routes.Features,
          external: false,
        },
        {
          title: t('Marketing.footer.product.items.pricing'),
          href: Routes.Pricing,
          external: false,
        },
        {
          title: t('Marketing.footer.product.items.faq'),
          href: Routes.FAQ,
          external: false,
        },
      ],
    },
    {
      title: t('Marketing.footer.resources.title'),
      items: [
        {
          title: t('Marketing.footer.resources.items.blog'),
          href: Routes.Blog,
          external: false,
        },
        {
          title: t('Marketing.footer.resources.items.changelog'),
          href: Routes.Changelog,
          external: false,
        },
        {
          title: t('Marketing.footer.resources.items.roadmap'),
          href: Routes.Roadmap,
          external: true,
        },
      ],
    },
    {
      title: t('Marketing.footer.company.title'),
      items: [
        {
          title: t('Marketing.footer.company.items.about'),
          href: Routes.About,
          external: false,
        },
        {
          title: t('Marketing.footer.company.items.contact'),
          href: Routes.Contact,
          external: false,
        },
        {
          title: t('Marketing.footer.company.items.waitlist'),
          href: Routes.Waitlist,
          external: false,
        },
      ],
    },
    {
      title: t('Marketing.footer.legal.title'),
      items: [
        {
          title: t('Marketing.footer.legal.items.cookiePolicy'),
          href: Routes.CookiePolicy,
          external: false,
        },
        {
          title: t('Marketing.footer.legal.items.privacyPolicy'),
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: t('Marketing.footer.legal.items.termsOfService'),
          href: Routes.TermsOfService,
          external: false,
        },
      ],
    },
  ];
}
