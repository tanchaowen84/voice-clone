import * as React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Mdx } from '@/components/marketing/blog/mdx-component';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';
import { Post } from 'content-collections';

type BlogPostProps = {
  post: Post;
};

export function BlogPost({ post }: BlogPostProps): React.JSX.Element {
  console.log(post);
  console.log(post.author);
  return (
    <div className="border-b">
      <div className="container mx-auto flex max-w-3xl flex-col space-y-4 py-20">
        <div className="mx-auto w-full min-w-0">
          <Link
            href="/blog"
            className="group mb-12 flex items-center space-x-1 text-base leading-none text-foreground duration-200"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            <span>All posts</span>
          </Link>
          <div className="space-y-8">
            <div className="flex flex-row items-center justify-between gap-4 text-base text-muted-foreground">
              <span className="flex flex-row items-center gap-2">
                {post.categories.map((c) => c?.name).join(', ')}
              </span>
              <span className="flex flex-row items-center gap-2">
                <time dateTime={post.date}>
                  {format(post.date, 'dd MMM yyyy')}
                </time>
              </span>
            </div>
            <h1 className="font-heading text-3xl font-semibold tracking-tighter xl:text-5xl">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground">{post.description}</p>
            <div className="flex flex-row items-center justify-between">
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
                <span>{post.author?.name ?? ''}</span>
              </div>
              <div>{estimateReadingTime(post.body.raw)}</div>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="container mx-auto flex max-w-3xl py-20">
        <Mdx code={post.body.code} />
      </div>
    </div>
  );
}

function estimateReadingTime(
  text: string,
  wordsPerMinute: number = 250
): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes === 1 ? '1 minute read' : `${minutes} minutes read`;
}
