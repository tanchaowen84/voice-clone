import { Skeleton } from "@/components/ui/skeleton";
import { getBaseUrl } from "@/lib/urls/get-base-url";
import { getLocaleDate } from "@/lib/utils";
import { Post } from "content-collections";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const publishDate = post.date;
  const date = getLocaleDate(publishDate);
  // const postUrlPrefix = "/blog";
  const postUrlPrefix = getBaseUrl();
  const postUrl = `${postUrlPrefix}${post.slug}`;

  return (
    <div className="group cursor-pointer flex flex-col border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden h-full">
      {/* Image container - fixed aspect ratio */}
      <div className="group overflow-hidden relative aspect-[16/9] w-full">
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
      <div className="flex flex-col justify-between p-4 flex-1">
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
          <div className="mt-2">
            {post.description && (
              <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href={postUrl}>{post.description}</Link>
              </p>
            )}
          </div>
        </div>

        {/* Author and date */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between space-x-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 flex-shrink-0">
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
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden h-full">
      <div className="overflow-hidden relative aspect-[16/9] w-full">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
        </div>
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
