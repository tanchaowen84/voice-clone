'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { Category } from 'content-collections';
import { LocaleLink } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export type BlogCategoryListDesktopProps = {
  categoryList: Category[];
};

export function BlogCategoryListDesktop({
  categoryList,
}: BlogCategoryListDesktopProps) {
  const { slug } = useParams() as { slug?: string };
  const t = useTranslations('BlogPage');

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        size="sm"
        type="single"
        value={slug || 'All'}
        aria-label="Toggle blog category"
        className="h-9 overflow-hidden rounded-full border bg-background p-1 *:h-7 *:text-muted-foreground"
      >
        <ToggleGroupItem
          key="All"
          value="All"
          className={cn(
            'rounded-full px-5',
            'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
            'hover:bg-muted hover:text-muted-foreground'
          )}
          aria-label={'Toggle all blog categories'}
        >
          <LocaleLink href={'/blog'}>
            <h2>{t('all')}</h2>
          </LocaleLink>
        </ToggleGroupItem>

        {categoryList.map((category) => (
          <ToggleGroupItem
            key={category.slug}
            value={category.slug}
            className={cn(
              'rounded-full px-5',
              'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
              'hover:bg-muted hover:text-muted-foreground'
            )}
            aria-label={`Toggle blog category of ${category.name}`}
          >
            <LocaleLink href={`/blog/category/${category.slug}`}>
              <h2>{category.name}</h2>
            </LocaleLink>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
