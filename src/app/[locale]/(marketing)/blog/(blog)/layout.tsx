import { BlogCategoryFilter } from '@/components/blog/blog-category-filter';
import Container from '@/components/container';
import { HeaderSection } from '@/components/shared/header-section';
import { PropsWithChildren } from 'react';
import { allCategories } from 'content-collections';
import { getTranslations } from 'next-intl/server';
import { NextPageProps } from '@/types/next-page-props';

interface BlogListLayoutProps extends PropsWithChildren, NextPageProps {}

export default async function BlogListLayout({ 
  children,
  params 
}: BlogListLayoutProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const t = await getTranslations("BlogPage");
  
  // Filter categories by locale
  // console.log("allCategories", allCategories);
  const categoryList = allCategories.filter(
    category => category.locale === locale
  );
  
  return (
    <div className="mb-16">
      <div className="mt-8 w-full flex flex-col items-center justify-center gap-8">
        <HeaderSection
          titleAs="h2"
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <BlogCategoryFilter categoryList={categoryList} />
      </div>

      <Container className="mt-8 px-4">
        {children}
      </Container>
    </div>
  );
}
