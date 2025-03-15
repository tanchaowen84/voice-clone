'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { getSidebarMainLinks } from '@/config';
import { LocaleLink } from '@/i18n/navigation';
import { createTranslator } from '@/i18n/translator';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SidebarMain() {
  const t = useTranslations();
  const translator = createTranslator(t);
  const sidebarMainLinks = getSidebarMainLinks(translator);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarMainLinks.map((item) => (
          <>
            {item.items?.length ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
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
                          <SidebarMenuSubButton asChild>
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
                <SidebarMenuButton asChild tooltip={item.title}>
                  <LocaleLink href={item.href || ''}>
                    {item.icon ? item.icon : null}
                    <span>{item.title}</span>
                  </LocaleLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
            }
          </>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
