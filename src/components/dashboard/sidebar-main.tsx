'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
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
      {/* <SidebarGroupLabel>Dashboard</SidebarGroupLabel> */}
      <SidebarMenu>
        {sidebarMainLinks.map((item) => (
          <Collapsible key={item.title} asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <LocaleLink href={item.href || ''}>
                  {item.icon ? item.icon : null}
                  <span>{item.title}</span>
                </LocaleLink>
              </SidebarMenuButton>

              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
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
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
