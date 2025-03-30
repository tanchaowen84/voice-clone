'use client';

import Container from '@/components/container';
import { ModeSwitcherHorizontal } from '@/components/layout/mode-switcher-horizontal';
import { Logo } from '@/components/logo';
import BuiltWithButton from '@/components/shared/built-with-button';
import { getFooterLinks, getSocialLinks } from '@/config';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ThemeSelector } from './theme-selector';

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations();
  const footerLinks = getFooterLinks();
  const socialLinks = getSocialLinks();

  return (
    <footer className={cn('border-t', className)}>
      <Container className="px-4">
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-6">
          <div className="flex flex-col items-start col-span-full md:col-span-2">
            <div className="space-y-4">
              {/* logo and name */}
              <div className="items-center space-x-2 flex">
                <Logo />
                <span className="text-xl font-semibold">
                  {t('Metadata.name')}
                </span>
              </div>

              {/* tagline */}
              <p className="text-muted-foreground text-base py-2 md:pr-12">
                {t('Metadata.tagline')}
              </p>

              {/* social links */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-2">
                  {socialLinks &&
                    socialLinks.map((link) => (
                      <a
                        key={link.title}
                        href={link.href || '#'}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.title}
                        className="border border-border inline-flex h-8 w-8 items-center 
                          justify-center rounded-full hover:bg-accent hover:text-accent-foreground"
                      >
                        <span className="sr-only">{link.title}</span>
                        {link.icon ? link.icon : null}
                      </a>
                    ))}
                </div>
              </div>

              {/* built with button */}
              <BuiltWithButton />
            </div>
          </div>

          {/* footer links */}
          {footerLinks &&
            footerLinks.map((section) => (
              <div
                key={section.title}
                className="col-span-1 md:col-span-1 items-start"
              >
                <span className="text-sm font-semibold uppercase">
                  {section.title}
                </span>
                <ul className="mt-4 list-inside space-y-3">
                  {section.items?.map(
                    (item) =>
                      item.href && (
                        <li key={item.title}>
                          <LocaleLink
                            href={item.href || '#'}
                            target={item.external ? '_blank' : undefined}
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            {item.title}
                          </LocaleLink>
                        </li>
                      )
                  )}
                </ul>
              </div>
            ))}
        </div>
      </Container>

      <div className="border-t py-8">
        <Container className="px-4 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} {t('Metadata.name')} All Rights
            Reserved.
          </span>

          <div className="flex items-center gap-x-4">
            <ThemeSelector />
            <ModeSwitcherHorizontal />
          </div>
        </Container>
      </div>
    </footer>
  );
}
