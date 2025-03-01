import { BlogGridSkeleton } from "@/components/blog/blog-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Basic information */}
          <div className="space-y-8">
            {/* blog post image */}
            <Skeleton className="w-full aspect-[16/9] rounded-lg" />

            {/* blog post title */}
            <Skeleton className="h-12 w-1/2" />

            {/* blog post description */}
            <Skeleton className="h-20 w-full" />
          </div>

          {/* blog post content */}
          <div className="mt-8 space-y-4">
            <Skeleton className="h-96 w-full" />
          </div>

          <div className="flex items-center justify-start mt-16">
            {/* <AllPostsButton /> */}
          </div>
        </div>

        {/* Right column (sidebar) */}
        <div>
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* author info */}
            <div className="bg-muted/50 rounded-lg p-6">
              <Skeleton className="h-8 w-24 mb-4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            {/* categories */}
            <div className="bg-muted/50 rounded-lg p-6">
              <Skeleton className="h-8 w-24 mb-4" />
              <div className="flex flex-wrap gap-4">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-6 w-20" />
                ))}
              </div>
            </div>

            {/* table of contents */}
            <div className="bg-muted/50 rounded-lg p-6 hidden lg:block">
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-6 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer section shows related posts */}
      <div className="flex flex-col gap-8 mt-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-6" />
          <Skeleton className="h-8 w-32" />
        </div>

        <BlogGridSkeleton count={3} />
      </div>
    </div>
  );
}
