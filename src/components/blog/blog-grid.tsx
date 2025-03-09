import BlogCard, { BlogCardSkeleton } from '@/components/blog/blog-card';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { Post } from 'content-collections';

interface BlogGridProps {
  posts: Post[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  // console.log('BlogGrid, posts', posts);
  return (
    <div>
      {posts?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export function BlogGridSkeleton({
  count = POSTS_PER_PAGE,
}: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}
