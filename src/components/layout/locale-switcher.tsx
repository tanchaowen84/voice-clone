'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocalePathname, useLocaleRouter } from '@/i18n/navigation';
import { Locale, LOCALE_LIST, routing } from '@/i18n/routing';
import { useLocaleStore } from '@/stores/locale-store';
import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useTransition } from 'react';

/**
 * LocaleSwitcher component
 * 
 * Allows users to switch between available locales using a dropdown menu.
 * 
 * Based on next-intl's useRouter and usePathname for locale navigation.
 * https://next-intl.dev/docs/routing/navigation#userouter
 */
export default function LocaleSwitcher() {
  const router = useLocaleRouter();
  const pathname = useLocalePathname();
  const params = useParams();
  const locale = useLocale();
  const { currentLocale, setCurrentLocale } = useLocaleStore();
  const [, startTransition] = useTransition();
  const t = useTranslations('Common');
  
  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale, setCurrentLocale]);

  function onSelectLocale(nextLocale: Locale) {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="size-9 p-0.5 border border-border rounded-full"
        >
          <Languages className="size-3" />
          <span className="sr-only">{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((localeOption) => (
          <DropdownMenuItem
            key={localeOption}
            onClick={() => onSelectLocale(localeOption)}
            className="cursor-pointer"
          >
            <span className="mr-2 text-md">{LOCALE_LIST[localeOption].flag}</span>
            <span className="text-sm">{LOCALE_LIST[localeOption].name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
