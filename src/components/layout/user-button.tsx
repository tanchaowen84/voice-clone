'use client';

import { UserAvatar } from '@/components/shared/user-avatar';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAvatarLinks } from '@/config';
import { useMediaQuery } from '@/hooks/use-media-query';
import { LocaleLink, useLocaleRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { User } from 'better-auth';
import { LogOutIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

interface UserButtonProps {
  user: User;
}

export function UserButton({ user }: UserButtonProps) {
  const t = useTranslations();
  const avatarLinks = getAvatarLinks();
  const localeRouter = useLocaleRouter();
  const [open, setOpen] = useState(false);
  const closeDrawer = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log('sign out success');
          localeRouter.replace('/');
        },
        onError: (error) => {
          console.error('sign out error:', error);
          toast.error(t('Common.logoutFailed'));
        },
      },
    });
  };

  const { isMobile } = useMediaQuery();

  // Mobile View, use Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onClose={closeDrawer}>
        <DrawerTrigger onClick={() => setOpen(true)}>
          <UserAvatar
            name={user.name}
            image={user.image}
            className="size-8 border cursor-pointer"
          />
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 z-40 bg-background/50" />
          <DrawerContent
            className="fixed inset-x-0 bottom-0 z-50 mt-24 
            overflow-hidden rounded-t-[10px] border bg-background px-3 text-sm"
          >
            <DrawerHeader>
              <DrawerTitle />
            </DrawerHeader>
            <div className="flex items-center justify-start gap-4 p-2">
              <UserAvatar
                name={user.name}
                image={user.image}
                className="size-8 border cursor-pointer"
              />
              <div className="flex flex-col">
                <p className="font-medium">
                  {user.name}
                </p>
                <p className="w-[200px] truncate text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <ul className="mb-14 mt-1 w-full text-muted-foreground">
              {avatarLinks &&
                avatarLinks.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-lg text-foreground hover:bg-muted"
                  >
                    <LocaleLink
                      href={item.href || '#'}
                      onClick={closeDrawer}
                      className="flex w-full items-center gap-3 px-2.5 py-2"
                    >
                      {item.icon ? item.icon : null}
                      <p className="text-sm">{item.title}</p>
                    </LocaleLink>
                  </li>
                ))}

              <li
                key="logout"
                className="rounded-lg text-foreground hover:bg-muted"
              >
                <a
                  href="#"
                  onClick={async (event) => {
                    event.preventDefault();
                    closeDrawer();
                    handleSignOut();
                  }}
                  className="flex w-full items-center gap-3 px-2.5 py-2"
                >
                  <LogOutIcon className="size-4" />
                  <p className="text-sm">{t('Common.logout')}</p>
                </a>
              </li>
            </ul>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    );
  }

  // Desktop View, use DropdownMenu
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <UserAvatar
          name={user.name}
          image={user.image}
          className="size-8 border cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">
              {user.name}
            </p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />

        {avatarLinks.map((item) => (
          <DropdownMenuItem
            key={item.title}
            className="cursor-pointer"
            onClick={() => {
              if (item.href) {
                localeRouter.push(item.href);
              }
            }}
          >
            <div className="flex items-center space-x-2.5">
              {item.icon ? item.icon : null}
              <p className="text-sm">{item.title}</p>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={async (event) => {
            event.preventDefault();
            setOpen(false);
            handleSignOut();
          }}
        >
          <div className="flex items-center space-x-2.5">
            <LogOutIcon className="size-4" />
            <p className="text-sm">{t('Common.logout')}</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
