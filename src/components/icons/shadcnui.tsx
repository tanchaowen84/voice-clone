import React from 'react';
import type { SVGProps } from 'react';

/**
 * https://icon-sets.iconify.design/simple-icons/shadcnui/
 */
export function ShadcnuiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={48}
      height={48}
      viewBox="0 0 24 24"
      {...props}
    >
      <title>Shadcn UI</title>
      <path
        fill="currentColor"
        d="M22.219 11.784L11.784 22.219a1.045 1.045 0 0 0 1.476 1.476L23.695 13.26a1.045 1.045 0 0 0-1.476-1.476M20.132.305L.305 20.132a1.045 1.045 0 0 0 1.476 1.476L21.608 1.781A1.045 1.045 0 0 0 20.132.305"
      />
    </svg>
  );
}
