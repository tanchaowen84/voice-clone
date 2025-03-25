import { categories } from '@/components/blocks/blocks';
import BlocksNav from '@/components/blocks/blocks-nav';
import { PropsWithChildren } from 'react';

// The locale inconsistency issue has been fixed in the BlocksNav component
export default function CategoryLayout({ children }: PropsWithChildren) {
  return (
    <>
      <BlocksNav categories={categories} />
      <main>{children}</main>
    </>
  );
}
