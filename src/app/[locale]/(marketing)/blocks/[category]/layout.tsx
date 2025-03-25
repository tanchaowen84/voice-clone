import { categories } from '@/components/blocks/blocks';
import BlocksNav from '@/components/blocks/blocks-nav';
import { PropsWithChildren } from 'react';

export default function CategoryLayout({ children }: PropsWithChildren) {
  return (
    <>
      <BlocksNav categories={categories} />
      <main>{children}</main>
    </>
  );
}
