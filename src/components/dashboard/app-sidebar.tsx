'use client';

import * as React from 'react';
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from 'lucide-react';
import { NavMain } from '@/components/dashboard/nav-main';
import { NavProjects } from '@/components/dashboard/nav-projects';
import { NavSecondary } from '@/components/dashboard/nav-secondary';
import { NavUser } from '@/components/dashboard/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getWebsiteInfo } from '@/config';
import { createTranslator } from '@/i18n/translator';
import { useTranslations } from 'next-intl';
import { Logo } from '../logo';
import { LocaleLink } from '@/i18n/navigation';
import { Routes } from '@/routes';

const data = {
  navMain: [
    {
      title: 'Playground',
      url: '/ai/text',
      icon: Bot,
      isActive: true,
      items: [
        {
          title: 'AI Text',
          url: '/ai/text',
        },
        {
          title: 'AI Image',
          url: '/ai/image',
        },
        {
          title: 'AI Video',
          url: '/ai/video',
        },
        {
          title: 'AI Audio',
          url: '/ai/audio',
        },
      ],
    },
    {
      title: 'Settings',
      url: '/settings/general',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '/settings/general',
        },
        {
          title: 'Security',
          url: '/settings/security',
        },
        {
          title: 'Billing',
          url: '/settings/billing',
        }
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: Routes.Contact,
      icon: LifeBuoy,
    },
    {
      title: 'Roadmap',
      url: Routes.Roadmap,
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations();
  const websiteInfo = getWebsiteInfo(createTranslator(t));
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <LocaleLink href="/">
                <Logo className="size-8" />
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-lg">
                    {websiteInfo.name}
                  </span>
                </div>
              </LocaleLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
