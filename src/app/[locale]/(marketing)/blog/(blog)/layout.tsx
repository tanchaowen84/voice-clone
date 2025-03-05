import { BlogCategoryFilter } from '@/components/blog/blog-category-filter';
import Container from '@/components/container';
import { HeaderSection } from '@/components/shared/header-section';
import { PropsWithChildren } from 'react';
import { allCategories } from 'content-collections';

interface BlogListLayoutProps extends PropsWithChildren {
  params: {
    locale: string;
  };
}

export default async function BlogListLayout({ 
  children,
  params 
}: BlogListLayoutProps) {
  const { locale } = params;
  
  // Filter categories by locale
  const categoryList = allCategories.filter(
    category => category.locale === locale
  );
  
  return (
    <div className="mb-16">
      <div className="mt-8 w-full flex flex-col items-center justify-center gap-8">
        <HeaderSection
          titleAs="h2"
          title="MkSaaS Blog"
          subtitle="Read our latest blog posts about MkSaaS"
        />

        <BlogCategoryFilter categoryList={categoryList} />
      </div>

      <Container className="mt-8 px-4">
        {children}
      </Container>
    </div>
  );
}
