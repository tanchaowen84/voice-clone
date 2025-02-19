import * as React from 'react';
import Link from 'next/link';
import { allPosts } from 'content-collections';
import { format, isBefore } from 'date-fns';
import { ArrowRightIcon } from 'lucide-react';
import { GridSection } from '@/components/marketing/fragments/grid-section';
import { SiteHeading } from '@/components/marketing/fragments/site-heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FillRemainingSpace } from '@/components/fill-remaining-space';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { getInitials } from '@/lib/utils';

export function BlogPosts(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container space-y-20 py-20">
        <SiteHeading
          badge="Blog Posts"
          title="Insights & News"
          description="Learn more about our products and the latest news."
        />
        <div className="grid gap-x-12 gap-y-6 divide-y md:grid-cols-2 md:gap-x-6 md:divide-none xl:grid-cols-3">
          {allPosts
            .filter((post) => post.published)
            .slice()
            .sort((a, b) => (isBefore(a.date, b.date) ? 1 : -1))
            .map((post, index) => (
              <Link
                key={index}
                href={`${getBaseUrl()}${post.slug}`}
                className="md:duration-2000 flex h-full flex-col space-y-4 text-clip border-dashed py-6 md:rounded-2xl md:px-6 md:shadow md:transition-shadow md:hover:shadow-xl dark:md:bg-accent/40 dark:md:hover:bg-accent"
              >
                <div className="flex flex-row items-center justify-between text-muted-foreground">
                  <span className="text-sm">{post.categories.map((c) => c.name).join(', ')}</span>
                  <time
                    className="text-sm"
                    dateTime={post.date}
                  >
                    {format(post.date, 'dd MMM yyyy')}
                  </time>
                </div>
                <h2 className="text-lg font-semibold md:mb-4 md:text-xl lg:mb-6">
                  {post.title}
                </h2>
                <p className="line-clamp-3 text-muted-foreground md:mb-4 lg:mb-6">
                  {post.description}
                </p>
                <FillRemainingSpace />
                <div className="flex flex-1 shrink flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <Avatar className="relative size-7 flex-none rounded-full">
                      <AvatarImage
                        src={post.author?.avatar}
                        alt="avatar"
                      />
                      <AvatarFallback className="size-7 text-[10px]">
                        {getInitials(post.author?.name ?? '')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{post.author?.name ?? ''}</span>
                  </div>
                  <div className="group flex items-center gap-2 text-sm duration-200  hover:underline">
                    Read more
                    <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </GridSection>
  );
}
