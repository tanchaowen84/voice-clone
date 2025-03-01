'use client';

import { Logo } from '@/components/logo';
import { DOCS_LINKS, MENU_LINKS } from '@/components/marketing/marketing-links';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { siteConfig } from '@/config/site';
import { Routes } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { Portal } from '@radix-ui/react-portal';
import { ChevronDown, ChevronUp, MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { Icons } from '../icons/icons';
import { ThemeSwitcherHorizontal } from '@/components/layout/theme-switcher-horizontal';

export function NavbarMobile({
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState<boolean>(false);
  const pathname = usePathname();
  const isDocs = pathname.startsWith('/docs');

  React.useEffect(() => {
    const handleRouteChangeStart = () => {
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }

      setOpen(false);
    };

    handleRouteChangeStart();
  }, [pathname]);

  const handleChange = () => {
    const mediaQueryList = window.matchMedia('(min-width: 1024px)');
    setOpen((open) => (open ? !mediaQueryList.matches : false));
  };

  React.useEffect(() => {
    handleChange();
    const mediaQueryList = window.matchMedia('(min-width: 1024px)');
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  const handleToggleMobileMenu = (): void => {
    setOpen((open) => !open);
  };

  return (
    <>
      <div
        className={cn('flex items-center justify-between', className)}
        {...other}
      >
        {/* navbar left shows logo */}
        <Link href={Routes.Root} className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-semibold">{siteConfig.name}</span>
        </Link>

        {/* navbar right shows menu icon */}
        <Button
          variant="ghost"
          size="icon"
          aria-expanded={open}
          aria-label="Toggle Mobile Menu"
          onClick={handleToggleMobileMenu}
          className="flex aspect-square h-fit select-none items-center justify-center rounded-md border"
        >
          {open ? (
            <X className="size-8" />
          ) : (
            <MenuIcon className="size-8" />
          )}
        </Button>
      </div>

      {/* mobile menu */}
      {open && (
        <Portal asChild>
          <RemoveScroll allowPinchZoom enabled>
            {isDocs ? (
              <DocsMobileMenu onLinkClicked={handleToggleMobileMenu} />
            ) : (
              <MainMobileMenu onLinkClicked={handleToggleMobileMenu} />
            )}
          </RemoveScroll>
        </Portal>
      )}
    </>
  );
}

type MainMobileMenuProps = {
  onLinkClicked: () => void;
};

function MainMobileMenu({ onLinkClicked }: MainMobileMenuProps) {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  return (
    <div className="fixed inset-0 z-50 mt-[72px] overflow-y-auto bg-background animate-in fade-in-0">
      <div className="flex size-full flex-col items-start space-y-4 p-4">
        {/* action buttons */}
        <div className="flex w-full flex-col gap-2">
          <Link
            href={Routes.Login}
            onClick={onLinkClicked}
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'lg'
              }),
              'w-full'
            )}
          >
            Log in
          </Link>
          <Link
            href={Routes.SignUp}
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'lg'
              }),
              'w-full'
            )}
            onClick={onLinkClicked}
          >
            Sign up
          </Link>
        </div>

        {/* main menu */}
        <ul className="w-full">
          {MENU_LINKS.map((item) => (
            <li key={item.title} className="py-2">
              {item.items ? (
                <Collapsible
                  open={expanded[item.title.toLowerCase()]}
                  onOpenChange={(isOpen) =>
                    setExpanded((prev) => ({
                      ...prev,
                      [item.title.toLowerCase()]: isOpen
                    }))
                  }
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex h-8 w-full items-center justify-between text-left"
                    >
                      <span className="text-base font-medium">
                        {item.title}
                      </span>
                      {expanded[item.title.toLowerCase()] ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="mt-2 pl-4">
                      {item.items.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            href={subItem.href || '#'}
                            target={subItem.external ? '_blank' : undefined}
                            rel={
                              subItem.external
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            className={cn(
                              buttonVariants({ variant: 'ghost' }),
                              'm-0 h-auto w-full justify-start gap-4 p-2'
                            )}
                            onClick={onLinkClicked}
                          >
                            <div className="flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
                              {subItem.icon}
                            </div>
                            <div>
                              <span className="text-sm font-medium">
                                {subItem.title}
                                {subItem.external && (
                                  <Icons.externalLink className="-mt-2 ml-1 inline text-muted-foreground" />
                                )}
                              </span>
                              {subItem.description && (
                                <p className="text-xs text-muted-foreground">
                                  {subItem.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  href={item.href || '#'}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start'
                  )}
                  onClick={onLinkClicked}
                >
                  <span className="text-base">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* bottom buttons */}
        <div className="flex w-full items-center justify-between gap-2 border-t border-border/40 p-4">
          <div className="text-base font-medium"></div>
          <ThemeSwitcherHorizontal />
        </div>
      </div>
    </div>
  );
}

type DocsMobileMenuProps = {
  onLinkClicked: () => void;
};

function DocsMobileMenu({
  onLinkClicked
}: DocsMobileMenuProps): React.JSX.Element {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  return (
    <div className="fixed inset-0 z-50 mt-[69px] overflow-y-auto bg-background animate-in fade-in-0">
      <div className="flex size-full flex-col items-start space-y-3 p-4">
        <ul className="w-full">
          {DOCS_LINKS.map((item) => (
            <li
              key={item.title}
              className="py-2"
            >
              <Collapsible
                open={expanded[item.title.toLowerCase()]}
                onOpenChange={(isOpen) =>
                  setExpanded((prev) => ({
                    ...prev,
                    [item.title.toLowerCase()]: isOpen
                  }))
                }
              >
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex h-9 w-full items-center justify-between px-4 text-left"
                  >
                    <div className="flex flex-row items-center gap-2 text-base font-medium">
                      {item.icon}
                      {item.title}
                    </div>
                    {expanded[item.title.toLowerCase()] ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="mt-2 pl-4">
                    {item.items.map((subItem) => (
                      <li key={subItem.title}>
                        <Link
                          href={subItem.href || '#'}
                          className={cn(
                            buttonVariants({ variant: 'ghost' }),
                            'm-0 h-auto w-full justify-start gap-4 p-1.5 text-sm font-medium'
                          )}
                          onClick={onLinkClicked}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </li>
          ))}
        </ul>
        <div className="flex w-full items-center justify-between gap-2 border-y border-border/40 p-4">
          <div className="text-base font-medium"></div>
          <ThemeSwitcherHorizontal />
        </div>
      </div>
    </div>
  );
}
