import Container from '@/components/container';
import { HeaderSection } from '@/components/shared/header-section';
import { PropsWithChildren } from 'react';

export default async function BlogListLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <div className="mt-8 w-full flex flex-col items-center justify-center gap-8">
        <HeaderSection
          titleAs="h2"
          title="MkSaaS Blog"
          subtitle="Read our latest blog posts about MkSaaS"
        />

        {/* <BlogCategoryFilter /> */}
      </div>

      <Container className="mt-8 px-4">
        {children}
      </Container>
    </div>
  );
}
