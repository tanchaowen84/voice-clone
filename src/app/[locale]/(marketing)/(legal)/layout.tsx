import Container from '@/components/layout/container';
import type { PropsWithChildren } from 'react';

import '@/styles/mdx.css';

export default function LegalLayout({ children }: PropsWithChildren) {
  return (
    <Container className="py-16 px-4">
      <div className="mx-auto">{children}</div>
    </Container>
  );
}
