import BlogGrid from "@/components/blog/blog-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { allCategories, allPosts } from "content-collections";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const category = allCategories.find(
    (category) => category.slug === params.slug
  );
  
  if (!category) {
    console.warn(
      `generateMetadata, category not found for slug: ${params.slug}`,
    );
    return;
  }

  const ogImageUrl = new URL(`${siteConfig.url}/api/og`);
  ogImageUrl.searchParams.append("title", category.name);
  ogImageUrl.searchParams.append("description", category.description || "");
  ogImageUrl.searchParams.append("type", "Blog Category");

  return constructMetadata({
    title: `${category.name}`,
    description: category.description,
    canonicalUrl: `${siteConfig.url}/blog/category/${params.slug}`,
    // image: ogImageUrl.toString(),
  });
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string; locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { page } = searchParams as { [key: string]: string };
  const currentPage = page ? Number(page) : 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  
  // Filter posts by category and locale
  const filteredPosts = allPosts.filter(
    (post) => 
      post.published && 
      post.locale === params.locale &&
      post.categories.some(category => category.slug === params.slug)
  );
  
  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Paginate posts
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  const totalCount = filteredPosts.length;
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  
  console.log(
    "BlogCategoryPage, totalCount",
    totalCount,
    ", totalPages",
    totalPages,
  );

  return (
    <div>
      {/* when no posts are found */}
      {paginatedPosts.length === 0 && <EmptyGrid />}

      {/* when posts are found */}
      {paginatedPosts.length > 0 && (
        <div>
          <BlogGrid posts={paginatedPosts} />

          <div className="mt-8 flex items-center justify-center">
            <CustomPagination
              routePreix={`/blog/category/${params.slug}`}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
