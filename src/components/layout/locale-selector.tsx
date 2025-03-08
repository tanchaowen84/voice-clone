"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalePathname, useLocaleRouter } from "@/i18n/navigation";
import {
  DEFAULT_LOCALE,
  Locale,
  LOCALE_LIST,
  routing,
} from "@/i18n/routing";
import { useLocaleStore } from "@/stores/locale-store";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";

/**
 * 1. LocaleSelector
 * 
 * By combining usePathname with useRouter, you can change the locale for the current page 
 * programmatically by navigating to the same pathname, while overriding the locale.
 * Depending on if you're using the pathnames setting, you optionally have to forward params 
 * to potentially resolve an internal pathname.
 * 
 * https://next-intl.dev/docs/routing/navigation#userouter
 */
export default function LocaleSelector({showLocaleName = true}: {showLocaleName?: boolean}) {
  const router = useLocaleRouter();
  const pathname = useLocalePathname();
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
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={<span className="text-lg">{LOCALE_LIST[DEFAULT_LOCALE].flag}</span>}>
          {currentLocale && (
            <div className="flex items-center gap-2">
              <span className="text-lg">{LOCALE_LIST[currentLocale].flag}</span>
              {showLocaleName && <span>{LOCALE_LIST[currentLocale].name}</span>}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((cur) => (
          <SelectItem key={cur} value={cur} className="cursor-pointer flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-md">{LOCALE_LIST[cur].flag}</span>
              <span>{LOCALE_LIST[cur].name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}