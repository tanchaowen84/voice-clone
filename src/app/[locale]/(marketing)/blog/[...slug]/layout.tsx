import Container from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { PropsWithChildren } from 'react';

export default function BlogPostLayout({ children }: PropsWithChildren) {
  return (
    <Container className="py-8 md:py-12">
      <div className="mx-auto">
        {children}
      </div>
    </Container>
  );
} 