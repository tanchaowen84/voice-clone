"use client";
import React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowRight, Menu, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const menuItems = [
  { name: "Features", href: "#" },
  { name: "Solution", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "About", href: "#" },
];

export default function HeroSection4() {
  const [menuState, setMenuState] = React.useState(false);

  return (
    <>
      <main className="overflow-hidden">
        <section>
          <div className="relative">
            <div className="mx-auto max-w-7xl px-6">
              <div className="max-w-3xl text-center sm:mx-auto lg:mr-auto lg:mt-0 lg:w-4/5">
                <Link
                  href="/"
                  className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3"
                >
                  <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">
                    New
                  </span>
                  <span className="text-sm">Introduction Tailus UI Html</span>
                  <span className="bg-(--color-border) block h-4 w-px"></span>

                  <ArrowRight className="size-4" />
                </Link>

                <h1 className="mt-8 text-balance text-4xl font-semibold md:text-5xl xl:text-6xl xl:[line-height:1.125]">
                  Modern Software testing reimagined
                </h1>
                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">
                  Tailwindcss highly customizable components for building modern
                  websites and applications that look and feel the way you mean
                  it.
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">
                  Highly customizable components for building modern websites
                  and applications, with your personal spark.
                </p>

                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link href="#">
                      <Rocket className="relative size-4" />
                      <span className="text-nowrap">Start Building</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative mt-16">
              <div
                aria-hidden
                className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="relative mx-auto max-w-6xl overflow-hidden px-4">
                <Image
                  className="z-2 border-border/25 relative hidden rounded-2xl border dark:block"
                  src="/images/blocks/music.png"
                  alt="app screen"
                  width={2796}
                  height={2008}
                />
                <Image
                  className="z-2 border-border/25 relative rounded-2xl border dark:hidden"
                  src="/images/blocks/music-light.png"
                  alt="app screen"
                  width={2796}
                  height={2008}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
