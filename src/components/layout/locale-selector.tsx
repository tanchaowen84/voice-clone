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
import { Globe, GlobeIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";

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
      router.replace(
        { pathname }, // if your want to redirect to the current page
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