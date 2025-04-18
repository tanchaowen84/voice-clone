import Container from '@/components/layout/container';
import type { Category } from 'content-collections';
import { BlogCategoryListDesktop } from './blog-category-list-desktop';
import { BlogCategoryListMobile } from './blog-category-list-mobile';

interface BlogCategoryFilterProps {
  categoryList: Category[];
}

export function BlogCategoryFilter({ categoryList }: BlogCategoryFilterProps) {
  return (
    <section className="w-full">
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <BlogCategoryListDesktop categoryList={categoryList} />
      </Container>

      {/* Mobile View, no Container */}
      <div className="block md:hidden w-full">
        <BlogCategoryListMobile categoryList={categoryList} />
      </div>
    </section>
  );
}
