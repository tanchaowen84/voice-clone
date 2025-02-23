"use client";

import { Icons } from "@/components/icons/icons";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userButtonConfig } from "@/config/user-button";
// import { useCurrentUser } from "@/hooks/use-current-user";
import { useMediaQuery } from "@/hooks/use-media-query";
import { LogOutIcon } from "lucide-react";
// import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function UserButton() {
  const router = useRouter();
  // const user = useCurrentUser();
  // console.log('UserButton, user:', user);
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://example.com/john.jpg",
  };

  const [open, setOpen] = useState(false);
  const closeDrawer = () => {
    setOpen(false);
  };

  const { isMobile } = useMediaQuery();

  // if (!user) {
  //   return (
  //     <div className="size-8 animate-pulse rounded-full border bg-muted" />
  //   );
  // }

  // Mobile View, use Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onClose={closeDrawer}>
        <DrawerTrigger onClick={() => setOpen(true)}>
          <UserAvatar
            name={user.name || undefined}
            image={user.image || undefined}
            className="size-8 border"
          />
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 z-40 bg-background/50" />
          <DrawerContent className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background px-3 text-sm">
            <DrawerHeader>
              <DrawerTitle></DrawerTitle>
            </DrawerHeader>
            <div className="flex items-center justify-start gap-4 p-2">
              <UserAvatar
                name={user.name || undefined}
                image={user.image || undefined}
                className="size-8 border"
              />
              <div className="flex flex-col">
                {user.name && <p className="font-medium">{user.name}</p>}
                {user.email && (
                  <p className="w-[200px] truncate text-muted-foreground">
                    {user?.email}
                  </p>
                )}
              </div>
            </div>

            <ul className="mb-14 mt-1 w-full text-muted-foreground">
              {userButtonConfig.menus.map((item) => {
                const Icon = Icons[item.icon || "arrowRight"];
                return (
                  <li
                    key={item.href}
                    className="rounded-lg text-foreground hover:bg-muted"
                  >
                    <Link
                      href={item.href}
                      onClick={closeDrawer}
                      className="flex w-full items-center gap-3 px-2.5 py-2"
                    >
                      <Icon className="size-4" />
                      <p className="text-sm">{item.title}</p>
                    </Link>
                  </li>
                );
              })}
              <li
                key="logout"
                className="rounded-lg text-foreground hover:bg-muted"
              >
                <Link
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    closeDrawer();
                    // signOut({
                    //   callbackUrl: `${window.location.origin}/`,
                    //   redirect: true,
                    // });
                  }}
                  className="flex w-full items-center gap-3 px-2.5 py-2"
                >
                  <LogOutIcon className="size-4" />
                  <p className="text-sm">Log out</p>
                </Link>
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
          name={user.name || undefined}
          image={user.image || undefined}
          className="size-8 border"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        {userButtonConfig.menus.map((item) => {
          const Icon = Icons[item.icon || "arrowRight"];
          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className="cursor-pointer"
              onClick={() => {
                router.push(item.href);
              }}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className="size-4" />
                <p className="text-sm">{item.title}</p>
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            // signOut({
            //   callbackUrl: `${window.location.origin}/`,
            //   redirect: true,
            // });
          }}
        >
          <div className="flex items-center space-x-2.5">
            <LogOutIcon className="size-4" />
            <p className="text-sm">Log out</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
