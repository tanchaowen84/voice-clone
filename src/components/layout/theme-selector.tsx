"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeConfig } from "./active-theme";
import { useTranslations } from "next-intl";

/**
 * 1. The component allows the user to select the theme of the website
 * 2. All the themes are copied from the shadcn-ui dashboard example
 * https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(examples)/dashboard/theme.css
 * https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(examples)/dashboard/components/theme-selector.tsx
 * https://github.com/TheOrcDev/orcish-dashboard/blob/main/components/theme-selector.tsx
 */
export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();
  const t = useTranslations('Common');

  const DEFAULT_THEMES = [
    {
      name: t('theme.default'),
      value: "default",
    },
    {
      name: t('theme.neutral'),
      value: "neutral",
    },
    {
      name: t('theme.blue'),
      value: "blue",
    },
    {
      name: t('theme.green'),
      value: "green",
    },
    {
      name: t('theme.amber'),
      value: "amber",
    },
  ];

  const SCALED_THEMES = [
    {
      name: t('theme.default-scaled'),
      value: "default-scaled",
    },
    {
      name: t('theme.blue-scaled'),
      value: "blue-scaled",
    },
  ];

  const MONO_THEMES = [
    {
      name: t('theme.mono-scaled'),
      value: "mono-scaled",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-selector" className="sr-only">
        {t('theme.label')}
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          size="sm"
          className="cursor-pointer justify-start *:data-[slot=select-value]:w-12"
        >
          <span className="text-muted-foreground block sm:hidden">
            {t('theme.label')}
          </span>
          <SelectValue placeholder={t('theme.label')} />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            <SelectLabel>{t('theme.default-theme')}</SelectLabel>
            {DEFAULT_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}
                className="cursor-pointer"
              >
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>{t('theme.scaled-theme')}</SelectLabel>
            {SCALED_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}
                className="cursor-pointer"
              >
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>{t('theme.mono-theme')}</SelectLabel>
            {MONO_THEMES.map((theme) => (
              <SelectItem key={theme.name} value={theme.value}
                className="cursor-pointer"
              >
                {theme.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
