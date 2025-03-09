'use client';

import LocaleSelector from '@/components/layout/locale-selector';
import { ThemeSwitcherHorizontal } from '@/components/layout/theme-switcher-horizontal';
import { Logo } from '@/components/logo';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { getMenuLinks } from '@/config';
import { createTranslator } from '@/i18n/translator';
import { siteConfig } from '@/config/site';
import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { Portal } from '@radix-ui/react-portal';
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { UserButton } from './user-button';

export function NavbarMobile({
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState<boolean>(false);
  const localePathname = useLocalePathname();
  const { data: session, error } = authClient.useSession();
  const user = session?.user;

  React.useEffect(() => {
    const handleRouteChangeStart = () => {
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }

      setOpen(false);
    };

    handleRouteChangeStart();
  }, [localePathname]);

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
        <LocaleLink href={Routes.Root} className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-semibold">{siteConfig.name}</span>
        </LocaleLink>

        {/* navbar right shows menu icon */}
        <div className="flex items-center justify-end gap-4">
          {/* show user button if user is logged in */}
          {user ? <UserButton /> : null}

          <Button
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-label="Toggle Mobile Menu"
            onClick={handleToggleMobileMenu}
            className="flex aspect-square h-fit select-none items-center 
              justify-center rounded-md border"
          >
            {open ? (
              <XIcon className="size-8" />
            ) : (
              <MenuIcon className="size-8" />
            )}
          </Button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <Portal asChild>
          {/* if we don't add RemoveScroll component, the underlying 
            page will scroll when we scroll the mobile menu */}
          <RemoveScroll allowPinchZoom enabled>
            <MainMobileMenu
              userLoggedIn={!!user}
              onLinkClicked={handleToggleMobileMenu}
            />
          </RemoveScroll>
        </Portal>
      )}
    </>
  );
}

interface MainMobileMenuProps {
  userLoggedIn: boolean;
  onLinkClicked: () => void;
}

function MainMobileMenu({ userLoggedIn, onLinkClicked }: MainMobileMenuProps) {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const t = useTranslations();
  const translator = createTranslator(t);
  const menuLinks = getMenuLinks(translator);
  const commonTranslations = useTranslations('Common');
  const localePathname = useLocalePathname();

  return (
    <div
      className="fixed w-full inset-0 z-50 mt-[72px] overflow-y-auto
      bg-background backdrop-blur-md animate-in fade-in-0"
    >
      <div className="size-full flex flex-col items-start space-y-4 p-4">
        {/* action buttons */}
        {userLoggedIn ? null : (
          <div className="w-full flex flex-col gap-4">
            <LocaleLink
              href={Routes.Login}
              onClick={onLinkClicked}
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                }),
                'w-full'
              )}
            >
              {commonTranslations('login')}
            </LocaleLink>
            <LocaleLink
              href={Routes.Register}
              className={cn(
                buttonVariants({
                  variant: 'default',
                  size: 'lg',
                }),
                'w-full'
              )}
              onClick={onLinkClicked}
            >
              {commonTranslations('signUp')}
            </LocaleLink>
          </div>
        )}

        {/* main menu */}
        <ul className="w-full">
          {menuLinks &&
            menuLinks.map((item) => {
              const isActive = item.href
                ? localePathname.startsWith(item.href)
                : item.items?.some(
                    (subItem) =>
                      subItem.href && localePathname.startsWith(subItem.href)
                  );

              return (
                <li key={item.title} className="py-2">
                  {item.items ? (
                    <Collapsible
                      open={expanded[item.title.toLowerCase()]}
                      onOpenChange={(isOpen) =>
                        setExpanded((prev) => ({
                          ...prev,
                          [item.title.toLowerCase()]: isOpen,
                        }))
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className={cn(
                            'flex w-full items-center justify-between text-left',
                            'bg-transparent text-muted-foreground',
                            'hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary',
                            isActive &&
                              'font-semibold bg-transparent text-primary'
                          )}
                        >
                          <span className="text-base">{item.title}</span>
                          {expanded[item.title.toLowerCase()] ? (
                            <ChevronUpIcon className="size-4" />
                          ) : (
                            <ChevronDownIcon className="size-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className="mt-2 pl-4 space-y-2">
                          {item.items.map((subItem) => {
                            const isSubItemActive =
                              subItem.href &&
                              localePathname.startsWith(subItem.href);

                            return (
                              <li key={subItem.title}>
                                <LocaleLink
                                  href={subItem.href || '#'}
                                  target={
                                    subItem.external ? '_blank' : undefined
                                  }
                                  rel={
                                    subItem.external
                                      ? 'noopener noreferrer'
                                      : undefined
                                  }
                                  className={cn(
                                    buttonVariants({ variant: 'ghost' }),
                                    'group h-auto w-full justify-start gap-4 p-2',
                                    'bg-transparent text-muted-foreground',
                                    'hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary',
                                    isSubItemActive &&
                                      'font-semibold bg-transparent text-primary'
                                  )}
                                  onClick={onLinkClicked}
                                >
                                  <div
                                    className={cn(
                                      'flex size-8 shrink-0 items-center justify-center transition-colors',
                                      'bg-transparent text-muted-foreground',
                                      'group-hover:bg-transparent group-hover:text-primary group-focus:bg-transparent group-focus:text-primary',
                                      isSubItemActive &&
                                        'bg-transparent text-primary'
                                    )}
                                  >
                                    {subItem.icon ? subItem.icon : null}
                                  </div>
                                  <div className="flex-1">
                                    <span
                                      className={cn(
                                        'text-sm text-muted-foreground',
                                        'group-hover:bg-transparent group-hover:text-primary group-focus:bg-transparent group-focus:text-primary',
                                        isSubItemActive &&
                                          'font-semibold bg-transparent text-primary'
                                      )}
                                    >
                                      {subItem.title}
                                    </span>
                                    {subItem.description && (
                                      <p
                                        className={cn(
                                          'text-xs text-muted-foreground',
                                          'group-hover:bg-transparent group-hover:text-primary/80 group-focus:bg-transparent group-focus:text-primary/80',
                                          isSubItemActive &&
                                            'bg-transparent text-primary/80'
                                        )}
                                      >
                                        {subItem.description}
                                      </p>
                                    )}
                                  </div>
                                  {subItem.external && (
                                    <ArrowUpRightIcon
                                      className={cn(
                                        'size-4 shrink-0 text-muted-foreground',
                                        'group-hover:bg-transparent group-hover:text-primary group-focus:bg-transparent group-focus:text-primary',
                                        isSubItemActive &&
                                          'bg-transparent text-primary'
                                      )}
                                    />
                                  )}
                                </LocaleLink>
                              </li>
                            );
                          })}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <LocaleLink
                      href={item.href || '#'}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'w-full justify-start',
                        'bg-transparent text-muted-foreground',
                        'hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary',
                        isActive && 'font-semibold bg-transparent text-primary'
                      )}
                      onClick={onLinkClicked}
                    >
                      <span className="text-base">{item.title}</span>
                    </LocaleLink>
                  )}
                </li>
              );
            })}
        </ul>

        {/* bottom buttons */}
        <div className="flex w-full items-center justify-between gap-4 border-t border-border/50 py-4">
          <LocaleSelector />
          <ThemeSwitcherHorizontal />
        </div>
      </div>
    </div>
  );
}
