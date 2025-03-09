import { Button } from '@react-email/components';
import React, { type PropsWithChildren } from 'react';

export default function EmailButton({
  href,
  children,
}: PropsWithChildren<{
  href: string;
}>) {
  return (
    <Button
      href={href}
      className="rounded-lg bg-black px-4 py-2 text-md text-white"
    >
      {children}
    </Button>
  );
}
