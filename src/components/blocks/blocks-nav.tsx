'use client';

import { LocaleLink, useLocalePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export default function BlocksNav({ categories }: { categories: string[] }) {
  const pathname = useLocalePathname();

  return (
    <div className="mt-4 dark:border-border/50 relative z-20 border-t">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center lg:-mx-3">
          <ul className="relative -mb-px flex h-12 snap-x snap-proximity scroll-px-6 items-center gap-6 overflow-x-auto overflow-y-hidden px-6 lg:scroll-px-2 lg:gap-5">
            {categories.map((category) => {
              const href = `/blocks/${category}`;
              const isActive = pathname.startsWith(href);
              
              return (
                <li
                  key={category}
                  className={cn(
                    'flex h-full snap-start items-center border-b border-b-transparent',
                    isActive && 'border-primary'
                  )}
                >
                  <LocaleLink
                    href={href}
                    prefetch={true}
                    className={cn(
                      isActive && 'text-foreground!',
                      'hover:bg-muted dark:text-muted-foreground hover:text-foreground flex h-7 w-fit items-center text-nowrap rounded-full px-2 text-sm text-zinc-700 lg:-mx-2 lg:px-3'
                    )}
                  >
                    <span className="block w-max text-nowrap capitalize">
                      {category}
                    </span>
                  </LocaleLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
