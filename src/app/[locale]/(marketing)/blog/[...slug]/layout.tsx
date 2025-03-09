import Container from '@/components/container';
import { PropsWithChildren } from 'react';

export default function BlogPostLayout({ children }: PropsWithChildren) {
  return (
    <Container className="py-8 px-4">
      <div className="mx-auto">{children}</div>
    </Container>
  );
}
