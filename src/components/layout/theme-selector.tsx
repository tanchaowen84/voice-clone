'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { websiteConfig } from '@/config/website';
import { useTranslations } from 'next-intl';
import { useThemeConfig } from './active-theme-provider';

/**
 * 1. The component allows the user to select the theme of the website
 * 2. All the themes are copied from the shadcn-ui dashboard example
 * https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(examples)/dashboard/theme.css
 * https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(examples)/dashboard/components/theme-selector.tsx
 * https://github.com/TheOrcDev/orcish-dashboard/blob/main/components/theme-selector.tsx
 */
export function ThemeSelector() {
  if (!websiteConfig.metadata.theme?.enableSwitch) {
    return null;
  }

  const { activeTheme, setActiveTheme } = useThemeConfig();
  const t = useTranslations('Common.theme');

  const DEFAULT_THEMES = [
    {
      name: t('default'),
      value: 'default',
    },
    {
      name: t('neutral'),
      value: 'neutral',
    },
    {
      name: t('blue'),
      value: 'blue',
    },
    {
      name: t('green'),
      value: 'green',
    },
    {
      name: t('amber'),
      value: 'amber',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-selector" className="sr-only">
        {t('label')}
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          size="sm"
          className="cursor-pointer justify-start *:data-[slot=select-value]:w-12"
        >
          <SelectValue placeholder={t('label')} />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {DEFAULT_THEMES.map((theme) => (
              <SelectItem
                key={theme.name}
                value={theme.value}
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
