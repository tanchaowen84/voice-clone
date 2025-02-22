import { Skeleton } from "@/components/ui/skeleton";
import { getBaseUrl } from "@/lib/urls/get-base-url";
import { getLocaleDate } from "@/lib/utils";
import { Post } from "content-collections";
import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  post: Post;
};

export default function BlogCard({ post }: BlogCardProps) {
  const publishDate = post.date;
  const date = getLocaleDate(publishDate);
  // const postUrlPrefix = "/blog";
  const postUrlPrefix = getBaseUrl();
  const postUrl = `${postUrlPrefix}${post.slug}`;

  return (
    <div className="group cursor-pointer flex flex-col gap-4">
      {/* Image container */}
      <div className="group overflow-hidden relative aspect-[16/9] rounded-lg transition-all">
        <Link href={postUrl}>
          {post.image && (
            <div className="relative w-full h-full">
              <Image
                src={post.image}
                alt={post.title || "image for blog post"}
                title={post.title || "image for blog post"}
                className="object-cover hover:scale-105 transition-transform duration-300"
                fill
              />

              {post.categories && post.categories.length > 0 && (
                <div className="absolute left-2 bottom-2 opacity-100 transition-opacity duration-300">
                  <div className="flex flex-wrap gap-1">
                    {post.categories.map((category, index) => (
                      <span
                        key={category.slug}
                        className="text-xs font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded-md"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Link>
      </div>

      {/* Post info container */}
      <div className="flex flex-col flex-grow">
        <div>
          {/* Post title */}
          <h3 className="text-lg line-clamp-2 font-medium">
            <Link href={postUrl}>
              <span
                className="bg-gradient-to-r from-green-200 to-green-100 
                  bg-[length:0px_10px] bg-left-bottom bg-no-repeat
                  transition-[background-size]
                  duration-500
                  hover:bg-[length:100%_3px]
                  group-hover:bg-[length:100%_10px]
                  dark:from-purple-800 dark:to-purple-900"
              >
                {post.title}
              </span>
            </Link>
          </h3>

          {/* Post excerpt, hidden for now */}
          <div className="hidden">
            {post.description && (
              <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                <Link href={postUrl}>{post.description}</Link>
              </p>
            )}
          </div>
        </div>

        {/* Author and date */}
        <div className="mt-auto pt-4 flex items-center justify-between space-x-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="relative h-5 w-5 flex-shrink-0">
              {post?.author?.avatar && (
                <Image
                  src={post?.author?.avatar}
                  alt={`avatar for ${post?.author?.name}`}
                  className="rounded-full object-cover border"
                  fill
                />
              )}
            </div>
            <span className="truncate text-sm">{post?.author?.name}</span>
          </div>

          <time className="truncate text-sm" dateTime={date}>
            {date}
          </time>
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="group cursor-pointer flex flex-col gap-4">
      <div className="group overflow-hidden relative aspect-[4/3] rounded-lg transition-all">
        <Skeleton className="w-full aspect-[4/3] rounded-lg" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}
