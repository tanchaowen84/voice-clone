"use client";

import { LoginWrapper } from "@/components/auth/login-button";
import Container from "@/components/container";
import { Icons } from "@/components/icons/icons";
import { UserButton } from "@/components/layout/user-button";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { useScroll } from "@/hooks/use-scroll";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { DashboardConfig, MarketingConfig, NestedNavItem } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavBarProps {
  scroll?: boolean;
  config: DashboardConfig | MarketingConfig;
}

export function Navbar({ scroll = false, config }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, error } = authClient.useSession();
  const user = session?.user;
  console.log(`Navbar, user:`, user);

  const pathname = usePathname();
  // console.log(`Navbar, pathname: ${pathname}`);
  const menus = config.menus;

  const isMenuActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    // console.log(`Navbar, href: ${href}, pathname: ${pathname}`);
    return pathname.startsWith(href);
  };

  const [open, setOpen] = useState(false);
  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Desktop View */}
      <header
        className={cn(
          "hidden md:flex justify-center bg-background/60 backdrop-blur-xl transition-all",
          scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b",
        )}
      >
        <Container className="flex h-16 items-center px-4">
          {/* navbar left show logo and links */}
          <div className="flex items-center gap-6 md:gap-10">
            {/* logo */}
            <a href="/" className="flex items-center space-x-2">
              <Logo />

              <span className="text-xl font-bold">{siteConfig.name}</span>
            </a>
          </div>

          {/* links */}
          <div className="flex-1 flex justify-center">
            {menus && menus.length > 0 ? (
              <NavigationMenu>
                <NavigationMenuList>
                  {menus.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            ) : null}
          </div>

          {/* navbar right show sign in or account */}
          <div className="flex items-center gap-x-4">
            {user ? (
              <div className="flex items-center">
                <UserButton />
              </div>
            ) : (
              <LoginWrapper mode="modal" asChild>
                <Button
                  className="flex gap-2"
                  variant="default"
                  size="sm"
                >
                  <span>Login</span>
                  {/* <ArrowRightIcon className="size-4" /> */}
                </Button>
              </LoginWrapper>
            )}
          </div>
        </Container>
      </header>

      {/* Mobile View */}
      <header className="md:hidden flex justify-center bg-background/60 backdrop-blur-xl transition-all">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          {/* mobile navbar left show menu icon when closed & show sheet when menu is open */}
          <div className="flex items-center gap-x-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 shrink-0"
                >
                  <MenuIcon className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href="/"
                      className="flex items-center space-x-2"
                      onClick={() => setOpen(false)}
                    >
                      <Logo />
                      <span className="text-xl font-bold">{siteConfig.name}</span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menus.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>

            {/* logo */}
            <a href="/"
              className="flex items-center space-x-2"
              onClick={() => setOpen(false)}
            >
              <Logo className="size-8" />

              <span className="text-xl font-bold">{siteConfig.name}</span>
            </a>
          </div>

          {/* mobile navbar right show sign in or user button */}
          <div className="flex items-center gap-x-4">
            {user ? (
              <div className="flex items-center">
                <UserButton />
              </div>
            ) : (
              <LoginWrapper mode="redirect" asChild>
                <Button
                  className="flex gap-2"
                  variant="default"
                  size="sm"
                >
                  <span>Login</span>
                  {/* <ArrowRightIcon className="size-4" /> */}
                </Button>
              </LoginWrapper>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

const renderMenuItem = (item: NestedNavItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger className="text-base">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-4">
            <NavigationMenuLink>
              {item.items.map((subItem) => {
                const CustomMenuIcon = Icons[subItem.icon || "arrowRight"];
                return (
                  <li key={subItem.title}>
                    <a
                      className="flex items-center select-none gap-4 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                      href={subItem.href}
                    >
                      {subItem.icon && <CustomMenuIcon className="size-4 shrink-0" />}
                      <div>
                        <div className="text-base text-foreground/60 hover:text-foreground">
                          {subItem.title}
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <Link
        href={item.disabled ? "#" : item.href || "#"}
        target={item.external ? "_blank" : ""}
        className={cn(
          navigationMenuTriggerStyle(),
          "px-4 bg-transparent focus:bg-transparent text-base",
          "text-foreground/60 hover:text-foreground",
          item.disabled && "cursor-not-allowed opacity-80"
        )}
      >
        {item.title}
      </Link>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: NestedNavItem) => {
  console.log(`renderMobileMenuItem, item:`, item, `, items:`, item.items);
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => {
            const CustomMenuIcon = Icons[subItem.icon || "arrowRight"];
            return (
              <Link
                key={subItem.title}
                className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                href={subItem.disabled ? "#" : subItem.href}
              >
                {subItem.icon && <CustomMenuIcon className="size-4 shrink-0" />}
                <div>
                  <div className="text-sm font-semibold">{subItem.title}</div>
                </div>
              </Link>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    );
  }

  const CustomMenuIcon = Icons[item.icon || "arrowRight"];
  return (
    <Link
      key={item.title}
      href={item.disabled ? "#" : item.href || "#"}
      target={item.external ? "_blank" : ""}
      className="flex items-center rounded-md gap-2 p-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground"
    >
      {item.icon && <CustomMenuIcon className="size-4 shrink-0" />}
      {item.title}
    </Link>
  );
};
