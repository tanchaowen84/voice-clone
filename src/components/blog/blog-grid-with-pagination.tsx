import type { Post } from 'content-collections';
import EmptyGrid from '../shared/empty-grid';
import CustomPagination from '../shared/pagination';
import BlogGrid from './blog-grid';

interface BlogGridWithPaginationProps {
  posts: Post[];
  totalPages: number;
  routePrefix: string;
}

export default function BlogGridWithPagination({
  posts,
  totalPages,
  routePrefix,
}: BlogGridWithPaginationProps) {
  return (
    <div>
      {posts.length === 0 && <EmptyGrid />}
      {posts.length > 0 && (
        <div>
          <BlogGrid posts={posts} />
          <div className="mt-8 flex items-center justify-center">
            <CustomPagination
              routePrefix={routePrefix}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
