"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Locale,
  LOCALE_LIST,
  routing,
} from "@/i18n/routing";
import { useLocaleStore } from "@/stores/locale-store";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";

/**
 * 1. useRouter
 * By combining usePathname with useRouter, you can change the locale for the current page 
 * programmatically by navigating to the same pathname, while overriding the locale.
 * Depending on if you’re using the pathnames setting, you optionally have to forward params 
 * to potentially resolve an internal pathname.
 * 
 * https://next-intl.dev/docs/routing/navigation#userouter
 */
export default function LocaleSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const { currentLocale, setCurrentLocale } = useLocaleStore();
  const [, startTransition] = useTransition();

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale, setCurrentLocale]);

  function onSelectChange(nextLocale: Locale) {
    setCurrentLocale(nextLocale);

    startTransition(() => {
      // // For root path, just use the string
      // if (pathname === "/") {
      //   router.replace("/", { locale: nextLocale });
      //   return;
      // }

      // // For blog index
      // if (pathname === "/blog") {
      //   router.replace("/blog", { locale: nextLocale });
      //   return;
      // }

      // // For dynamic routes, reconstruct with the correct params
      // if (pathname.startsWith("/blog/")) {
      //   if (pathname.includes("category")) {
      //     router.replace({
      //       pathname: "/blog/category/[slug]",
      //       params: { slug: params.slug as string }
      //     }, { locale: nextLocale });
      //   } else {
      //     router.replace({
      //       pathname: "/blog/[...slug]",
      //       params: { slug: Array.isArray(params.slug) ? params.slug : [params.slug as string] }
      //     }, { locale: nextLocale });
      //   }
      //   return;
      // }

      // // Fallback for other routes
      // router.replace("/", { locale: nextLocale });

      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <Select
      defaultValue={locale}
      value={currentLocale}
      onValueChange={onSelectChange}
    >
      {/* w-[120px] is better than w-fit */}
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="🌐" />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((cur) => (
          <SelectItem key={cur} value={cur}
            className="flex items-center">
            {LOCALE_LIST[cur]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}