'use client';

import { LoginWrapper } from '@/components/auth/login-button';
import Container from '@/components/container';
import { ThemeSwitcher } from '@/components/layout/theme-switcher';
import { UserButton } from '@/components/layout/user-button';
import { Logo } from '@/components/logo';
import { MENU_LINKS } from '@/components/marketing/marketing-links';
import { NavbarMobile } from '@/components/marketing/navbar-mobile';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { siteConfig } from '@/config/site';
import { useScroll } from "@/hooks/use-scroll";
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { MarketingConfig } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRightIcon } from 'lucide-react';
import LocaleSelector from '@/components/layout/locale-selector';

interface NavBarProps {
  scroll?: boolean;
  config: MarketingConfig;
}

export function Navbar({ scroll, config }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, error } = authClient.useSession();
  const user = session?.user;
  // console.log(`Navbar, user:`, user);

  const pathname = usePathname();

  return (
    <section className={cn(
      "sticky inset-x-0 top-0 z-40 py-4 transition-all duration-300",
      scroll ? (
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-b supports-[backdrop-filter]:bg-background/60" 
          : "bg-background"
      ) : "border-b bg-background"
    )}>
      <Container className="px-4">
        {/* desktop navbar */}
        <nav className="hidden lg:flex">
          {/* logo and name */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-semibold">{siteConfig.name}</span>
            </a>
          </div>

          {/* menu links */}
          <div className="flex-1 flex items-center justify-center space-x-2">
            <NavigationMenu className="relative">
              <NavigationMenuList className="flex items-center">
                {MENU_LINKS.map((item, index) =>
                  item.items ? (
                    <NavigationMenuItem key={index} className="relative">
                      <NavigationMenuTrigger
                        data-active={
                          item.items.some((subItem) =>
                            pathname.startsWith(subItem.href)
                          )
                            ? ''
                            : undefined
                        }
                        className="data-[active]:bg-accent"
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="w-96 list-none p-2">
                          {item.items.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href || '#'}
                                  target={ subItem.external ? '_blank' : undefined }
                                  rel={
                                    subItem.external
                                      ? 'noopener noreferrer'
                                      : undefined
                                  }
                                  className="group flex select-none flex-row items-center gap-4 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
                                    {subItem.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">
                                      {subItem.title}
                                    </div>
                                    {subItem.description && (
                                      <div className="text-sm text-muted-foreground">
                                        {subItem.description}
                                      </div>
                                    )}
                                  </div>
                                  {subItem.external && (
                                    <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        asChild
                        active={pathname.startsWith(item.href)}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'data-[active]:bg-accent'
                        )}
                      >
                        <Link
                          href={item.href || '#'}
                          target={item.external ? '_blank' : undefined}
                          rel={
                            item.external ? 'noopener noreferrer' : undefined
                          }
                        >
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* navbar right show sign in or user */}
          <div className="flex items-center gap-x-4">
            {user ? (
              <div className="flex items-center">
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-x-4">
                <LoginWrapper mode="modal" asChild>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <span>Log in</span>
                  </Button>
                </LoginWrapper>

                <Button
                  variant="default"
                  size="sm"
                  asChild
                >
                  <a href={Routes.Register}>
                    Sign up
                  </a>
                </Button>
              </div>
            )}

            {/* <ThemeSwitcher /> */}
            <LocaleSelector />
          </div>
        </nav>

        {/* mobile navbar */}
        <NavbarMobile className="lg:hidden" />
      </Container>
    </section>
  );
}
