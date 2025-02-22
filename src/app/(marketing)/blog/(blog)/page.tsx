import BlogGrid from "@/components/blog/blog-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { NextPageProps } from "@/types/next-page-props";
import { allPosts } from "content-collections";

export const metadata = constructMetadata({
  title: "Blog",
  description: "Read our latest blog posts",
  canonicalUrl: `${siteConfig.url}/blog`,
});

export default async function BlogIndexPage(props: NextPageProps) {
  const searchParams = await props.searchParams;
  console.log("BlogIndexPage, searchParams", searchParams);
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1;
  const posts = await Promise.all(
    allPosts
      .filter((post) => post.published)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice( (page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE, )
      // .map(async (post) => ({
      //   ...post,
      //   blurDataURL: await getBlurDataURL(post.image),
      // })),
  );
  // const posts = allPosts.slice(
  //   (currentPage - 1) * POSTS_PER_PAGE,
  //   currentPage * POSTS_PER_PAGE,
  // );
  const totalCount = allPosts.length;
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  console.log(
    "BlogIndexPage, totalCount",
    totalCount,
    ", totalPages",
    totalPages,
  );

  return (
    <div>
      {/* when no posts are found */}
      {posts?.length === 0 && <EmptyGrid />}

      {/* when posts are found */}
      {posts && posts?.length > 0 && (
        <div>
          <BlogGrid posts={posts} />

          <div className="mt-8 flex items-center justify-center">
            <CustomPagination routePreix="/blog" totalPages={totalPages} />
          </div>
        </div>
      )}
    </div>
  );
}
