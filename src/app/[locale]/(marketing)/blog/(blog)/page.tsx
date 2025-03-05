import { allPosts } from 'content-collections';
import { Metadata } from 'next';
import BlogGrid from '@/components/blog/blog-grid';
import Container from '@/components/container';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog',
    description: 'Latest news and updates from our team',
  };
}

interface BlogPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  
  // Filter posts by locale
  const localePosts = allPosts.filter(
    (post) => post.locale === locale && post.published
  );
  
  // If no posts found for the current locale, show all published posts
  const posts = localePosts.length > 0 
    ? localePosts 
    : allPosts.filter((post) => post.published);
  
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <BlogGrid posts={sortedPosts} />
  );
} 