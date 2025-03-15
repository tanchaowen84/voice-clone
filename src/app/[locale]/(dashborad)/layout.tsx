import { AppSidebar } from '@/components/dashboard/app-sidebar';
import {
  SidebarInset,
  SidebarProvider
} from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

export default function DashboardLayout({children}: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
