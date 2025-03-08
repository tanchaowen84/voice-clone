"use client";

import { UserAvatar } from "@/components/shared/user-avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createTranslator, getAvatarLinks } from "@/config/marketing";
import { useMediaQuery } from "@/hooks/use-media-query";
import { LocaleLink, useLocaleRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";

export function UserButton() {
  const { data: session, error } = authClient.useSession();
  const user = session?.user;
  const t = useTranslations();
  const translator = createTranslator(t);
  const avatarLinks = getAvatarLinks(translator);
  const commonTranslations = useTranslations("Common");

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log("sign out success");
          localeRouter.push("/");
        },
        onError: (error) => {
          console.error("sign out error:", error);
          // TODO: show error message
        },
      },
    });
  };

  const localeRouter = useLocaleRouter();
  const [open, setOpen] = useState(false);
  const closeDrawer = () => {
    setOpen(false);
  };

  const { isMobile } = useMediaQuery();
  
  // Mobile View, use Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onClose={closeDrawer}>
        <DrawerTrigger onClick={() => setOpen(true)}>
          <UserAvatar
            name={user?.name || undefined}
            image={user?.image || undefined}
            className="size-10 border"
          />
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 z-40 bg-background/50" />
          <DrawerContent className="fixed inset-x-0 bottom-0 z-50 mt-24 
            overflow-hidden rounded-t-[10px] border bg-background px-3 text-sm">
            <DrawerHeader>
              <DrawerTitle />
            </DrawerHeader>
            <div className="flex items-center justify-start gap-4 p-2">
              <UserAvatar
                name={user?.name || undefined}
                image={user?.image || undefined}
                className="size-10 border"
              />
              <div className="flex flex-col">
                {user?.name && <p className="font-medium">{user.name}</p>}
                {user?.email && (
                  <p className="w-[200px] truncate text-muted-foreground">
                    {user?.email}
                  </p>
                )}
              </div>
            </div>

            <ul className="mb-14 mt-1 w-full text-muted-foreground">
              {avatarLinks.map((item) => (
                <li
                  key={item.title}
                  className="rounded-lg text-foreground hover:bg-muted"
                >
                  <LocaleLink 
                    href={item.href || "#"}
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
                <a href="#"
                  onClick={async (event) => {
                    event.preventDefault();
                    closeDrawer();
                    handleSignOut();
                  }}
                  className="flex w-full items-center gap-3 px-2.5 py-2"
                >
                  <LogOutIcon className="size-4" />
                  <p className="text-sm">{commonTranslations("logout")}</p>
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
          name={user?.name || undefined}
          image={user?.image || undefined}
          className="size-10 border"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user.name}</p>}
            {user?.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            )}
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
            <p className="text-sm">{commonTranslations("logout")}</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
