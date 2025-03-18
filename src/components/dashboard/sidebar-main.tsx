'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { getSidebarMainLinks } from '@/config';
import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import { createTranslator } from '@/i18n/translator';
import { MenuItem } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

export function SidebarMain() {
  const t = useTranslations();
  const translator = createTranslator(t);
  const sidebarMainLinks = getSidebarMainLinks(translator);
  const pathname = useLocalePathname();

  // Function to check if a path is active
  const isActive = (href: string | undefined): boolean => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Function to check if any sub-item in a collapsible menu is active
  const hasActiveChild = (items: MenuItem[]): boolean => {
    if (!items?.length) return false;
    return items.some(item => isActive(item.href));
  };

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {sidebarMainLinks.map((item) => (
          <React.Fragment key={item.title}>
            {item.items?.length ? (
              <Collapsible
                asChild
                // NOTICE: show all collapsible items by default
                defaultOpen={true}
                // defaultOpen={hasActiveChild(item.items)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className='py-4'>
                      {item.icon ? item.icon : null}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform 
                        duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.href)}
                            className='py-4'
                          >
                            <LocaleLink href={subItem.href || ''}>
                              {subItem.icon ? subItem.icon : null}
                              <span>{subItem.title}</span>
                            </LocaleLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive(item.href)}
                  className='py-4'
                >
                  <LocaleLink href={item.href || ''}>
                    {item.icon ? item.icon : null}
                    <span>{item.title}</span>
                  </LocaleLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </React.Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
