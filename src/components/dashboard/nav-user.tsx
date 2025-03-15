'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLocaleRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UserAvatar } from '../shared/user-avatar';

export function NavUser() {
  const router = useLocaleRouter();
  const { isMobile } = useSidebar();
  const t = useTranslations('Common');

  const { data: session, error } = authClient.useSession();
  const user = session?.user;
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // console.log('sign out success');
          router.push('/');
        },
        onError: (error) => {
          console.error('sign out error:', error);
          // TODO: show error message
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent 
              data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar
                name={user.name || undefined}
                image={user.image || undefined}
                className="size-8 border"
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.name}
                </span>
                <span className="truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar
                  name={user.name || undefined}
                  image={user.image || undefined}
                  className="size-8 border"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async (event) => {
                event.preventDefault();
                handleSignOut();
              }}
            >
              <LogOut />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
