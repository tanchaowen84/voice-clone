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
import { getSidebarLinks } from '@/config';
import { useCurrentUser } from '@/hooks/use-current-user';
import { LocaleLink } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { Logo } from '../layout/logo';
import { SidebarUpgradeCard } from './sidebar-upgrade-card';

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations();
  const sidebarLinks = getSidebarLinks();
  const currentUser = useCurrentUser();

  // user is a member if they have a lifetime membership or an active subscription
  const isMember = currentUser?.lifetimeMember ||
    (currentUser?.subscriptionId && currentUser?.subscriptionStatus === 'active');

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <LocaleLink href={Routes.Root}>
                <Logo className="size-5" />
                <span className="truncate font-semibold text-base">
                  {t('Metadata.name')}
                </span>
              </LocaleLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarLinks} />
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-4">
        {/* show upgrade card if user is not a member */}
        {!isMember && <SidebarUpgradeCard />}

        {/* show user profile if user is logged in */}
        {currentUser && <NavUser user={currentUser} />}
      </SidebarFooter>
    </Sidebar>
  );
}
