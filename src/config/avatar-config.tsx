'use client';

import { Routes } from '@/routes';
import { MenuItem } from '@/types';
import { CreditCardIcon, LayoutDashboardIcon, Settings2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Get avatar config with translations
 * 
 * NOTICE: used in client components only
 *
 * @returns The avatar config with translated titles
 */
export function getAvatarConfig(): MenuItem[] {
  const t = useTranslations();

  return [
    {
      title: t('Marketing.avatar.dashboard'),
      href: Routes.Dashboard,
      icon: <LayoutDashboardIcon className="size-4 shrink-0" />,
    },
    {
      title: t('Marketing.avatar.billing'),
      href: Routes.SettingsBilling,
      icon: <CreditCardIcon className="size-4 shrink-0" />,
    },
    {
      title: t('Marketing.avatar.settings'),
      href: Routes.SettingsProfile,
      icon: <Settings2Icon className="size-4 shrink-0" />,
    },
  ];
}
