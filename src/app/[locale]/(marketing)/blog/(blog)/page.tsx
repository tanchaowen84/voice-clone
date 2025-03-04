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
    <Container className="py-8 md:py-12">
      <div className="">
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="inline-block text-4xl font-bold tracking-tight lg:text-5xl">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Latest news and updates from our team
            </p>
          </div>
        </div>
        <BlogGrid posts={sortedPosts} />
      </div>
    </Container>
  );
} 