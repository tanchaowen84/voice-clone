import Container from '@/components/container';
import { PropsWithChildren } from 'react';

export default function LegalLayout({ children }: PropsWithChildren) {
  return (
    <Container className="py-16 px-4">
      <div className="mx-auto">
        {children}
      </div>
    </Container>
  );
} 