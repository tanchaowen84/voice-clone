import * as React from 'react';
import type { Metadata } from 'next';
import { BlogPosts } from '@/components/blog/blog-posts';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Blog')
};

export default function BlogPage(): React.JSX.Element {
  return <BlogPosts />;
}
