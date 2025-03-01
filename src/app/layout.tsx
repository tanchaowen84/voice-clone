import { PropsWithChildren } from 'react';

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: PropsWithChildren) {
  // Simply pass children through - the [locale] layout will handle the HTML structure
  return children;
}
