"use client";

import { Icons } from "@/components/icons/icons";
import { footerConfig } from "@/config/footer";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import type * as React from "react";
import Container from "@/components/container";
import { Logo } from "@/components/logo";
import BuiltWithButton from "@/components/shared/built-with-button";
import { ThemeSwitcherHorizontal } from "@/components/layout/theme-switcher-horizontal";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const { theme } = useTheme();

  return (
    <footer className={cn("border-t", className)}>
      <Container className="px-4">
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-6">
          <div className="flex flex-col items-start col-span-full md:col-span-2">
            <div className="space-y-4">
              {/* logo and name */}
              <div className="items-center space-x-2 flex">
                <Logo />
                <span className="text-xl font-semibold">{siteConfig.name}</span>
              </div>

              {/* tagline */}
              <p className="text-muted-foreground text-base py-2 md:pr-12">
                {siteConfig.tagline}
              </p>

              {/* social links */}
              <div className="flex items-center gap-4 py-1">
                <div className="flex items-center gap-2">
                  {siteConfig.mail && (
                    <Link
                      href={`mailto:${siteConfig.mail}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Email"
                      className="border border-border inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icons.email className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                  {siteConfig.links.github && (
                    <Link
                      href={siteConfig.links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="border border-border inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icons.github className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                  {siteConfig.links.twitter && (
                    <Link
                      href={siteConfig.links.twitter}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter"
                      className="border border-border inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icons.twitter className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                  {siteConfig.links.bluesky && (
                    <Link
                      href={siteConfig.links.bluesky}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Bluesky"
                      className="border border-border inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icons.bluesky className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                  {siteConfig.links.youtube && (
                    <Link
                      href={siteConfig.links.youtube}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="YouTube"
                      className="border border-border inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icons.youtube className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>

              {/* built with button */}
              <BuiltWithButton />
            </div>
          </div>

          {footerConfig.links.map((section) => (
            <div
              key={section.title}
              className="col-span-1 md:col-span-1 items-start"
            >
              <span className="text-sm font-semibold uppercase">
                {section.title}
              </span>
              <ul className="mt-4 list-inside space-y-3">
                {section.items?.map(
                  (link) =>
                    link.href && (
                      <li key={link.title}>
                        <Link
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t py-8">
        <Container className="px-4 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} All Rights Reserved.
          </span>

          <ThemeSwitcherHorizontal />
        </Container>
      </div>
    </footer>
  );
}
