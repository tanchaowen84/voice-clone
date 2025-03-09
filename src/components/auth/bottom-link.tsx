'use client';

import { buttonVariants } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface BottomLinkProps {
  href: string;
  label: string;
}

export const BottomLink = ({ href, label }: BottomLinkProps) => {
  return (
    <LocaleLink
      href={href}
      className={cn(
        buttonVariants({ variant: 'link', size: 'sm' }),
        'font-normal w-full text-muted-foreground hover:underline underline-offset-4 hover:text-primary'
      )}
    >
      {label}
    </LocaleLink>
  );
};
