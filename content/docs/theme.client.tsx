'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type ReactElement, useState } from 'react';

export function WidthTrigger(): ReactElement {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: 'secondary' }))}
      onClick={() => {
        setEnabled((prev) => !prev);
      }}
    >
      {enabled ? <style>{`:root { --fd-layout-width: 1400px; }`}</style> : null}
      Trigger Width:
      <span className="ms-1.5 text-fd-muted-foreground">
        {enabled ? '1400px' : 'default'}
      </span>
    </button>
  );
}
