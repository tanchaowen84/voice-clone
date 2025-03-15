import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import {
  SidebarInset,
  SidebarProvider
} from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

export default function DashboardLayout({children}: PropsWithChildren) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
