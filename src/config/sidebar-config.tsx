'use client';

import { Routes } from '@/routes';
import { NestedMenuItem } from '@/types';
import { 
  BellIcon, 
  CircleUserRoundIcon, 
  CreditCardIcon, 
  LayoutDashboardIcon, 
  LockKeyholeIcon, 
  Settings2Icon 
} from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Get sidebar config with translations
 *
 * NOTICE: used in client components only
 *
 * @returns The sidebar config with translated titles and descriptions
 */
export function getSidebarConfig(): NestedMenuItem[] {
  const t = useTranslations('Dashboard');

  return [
    {
      title: t('dashboard.title'),
      icon: <LayoutDashboardIcon className="site-4 shrink-0" />,
      href: Routes.Dashboard,
      external: false,
    },
    {
      title: t('settings.title'),
      icon: <Settings2Icon className="site-4 shrink-0" />,
      items: [
        {
          title: t('settings.profile.title'),
          icon: <CircleUserRoundIcon className="site-4 shrink-0" />,
          href: Routes.SettingsProfile,
          external: false,
        },
        {
          title: t('settings.billing.title'),
          icon: <CreditCardIcon className="site-4 shrink-0" />,
          href: Routes.SettingsBilling,
          external: false,
        },
        {
          title: t('settings.security.title'),
          icon: <LockKeyholeIcon className="site-4 shrink-0" />,
          href: Routes.SettingsSecurity,
          external: false,
        },
        {
          title: t('settings.notification.title'),
          icon: <BellIcon className="site-4 shrink-0" />,
          href: Routes.SettingsNotifications,
          external: false,
        }
      ],
    },
  ];
}
