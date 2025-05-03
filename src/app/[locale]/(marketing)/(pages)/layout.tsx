import type { PropsWithChildren } from 'react';

export default function PageLayout({ children }: PropsWithChildren) {
  return <div className="mx-auto">{children}</div>;
}
