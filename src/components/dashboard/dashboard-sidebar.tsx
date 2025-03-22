'use client';

import { NavMain } from '@/components/dashboard/nav-main';
import { NavUser } from '@/components/dashboard/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { getNavMainLinks } from '@/config';
import { LocaleLink } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { Logo } from '../logo';
import { SidebarUpgradeCard } from './sidebar-upgrade-card';

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations();
  const mainLinks = getNavMainLinks();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <LocaleLink href="/">
                <Logo className="size-5" />
                <span className="truncate font-semibold text-base">
                  {t('Site.name')}
                </span>
              </LocaleLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainLinks} />
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-4">
        <SidebarUpgradeCard />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
