import { categories } from '@/components/nsui/blocks';
import BlocksNav from '@/components/nsui/blocks-nav';
import type { PropsWithChildren } from 'react';

/**
 * The locale inconsistency issue has been fixed in the BlocksNav component
 */
export default function BlockCategoryLayout({ children }: PropsWithChildren) {
  return (
    <>
      <BlocksNav categories={categories} />

      <main>{children}</main>
    </>
  );
}
