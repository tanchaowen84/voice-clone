'use client';

import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface FilterItemMobileProps {
  title: string;
  href: string;
  active?: boolean;
  clickAction?: () => void;
}

export default function FilterItemMobile({
  title,
  href,
  active,
  clickAction,
}: FilterItemMobileProps) {
  return (
    <li className="mb-1 last:mb-0">
      <LocaleLink
        href={href}
        onClick={clickAction}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted',
          active && 'bg-primary text-primary-foreground hover:bg-primary/90'
        )}
      >
        {title}
      </LocaleLink>
    </li>
  );
}
