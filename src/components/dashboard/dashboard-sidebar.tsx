'use client';

import { SidebarMain } from '@/components/dashboard/sidebar-main';
import { SidebarUser } from '@/components/dashboard/sidebar-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { getSidebarLinks } from '@/config/sidebar-config';
import { authClient } from '@/lib/auth-client';
import { LocaleLink } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { Logo } from '../layout/logo';
import { UpgradeCard } from './upgrade-card';

/**
 * Dashboard sidebar
 */
export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations();
  const sidebarLinks = getSidebarLinks();
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;
  // console.log('sidebar currentUser:', currentUser);
  const filteredSidebarLinks = sidebarLinks.filter((link) => {
    if (link.authorizeOnly) {
      return link.authorizeOnly.includes(currentUser?.role || '');
    }
    return true;
  });

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
        <SidebarMain items={filteredSidebarLinks} />
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-4">
        {/* Only show UI components when not in loading state */}
        {!isPending && (
          <>
            {/* show upgrade card if user is not a member */}
            {currentUser && <UpgradeCard />}

            {/* show user profile if user is logged in */}
            {currentUser && <SidebarUser user={currentUser} />}
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
