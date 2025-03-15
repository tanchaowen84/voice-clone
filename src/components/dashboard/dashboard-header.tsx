import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  isCurrentPage?: boolean;
}

interface DashboardHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  actions?: ReactNode;
}

export function DashboardHeader({ breadcrumbs, actions }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={`breadcrumb-${index}`}>
                {index > 0 && (
                  <BreadcrumbSeparator key={`sep-${index}`} className="hidden md:block" />
                )}
                <BreadcrumbItem 
                  key={`item-${index}`} 
                  className={index < breadcrumbs.length - 1 ? "hidden md:block" : ""}
                >
                  {item.isCurrentPage ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    item.label
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {actions && (
        <div className="ml-auto flex items-center gap-2 px-4">
          {actions}
        </div>
      )}
    </header>
  );
} 