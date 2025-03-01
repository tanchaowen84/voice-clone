import { redirect } from 'next/navigation';

/**
 * This page only renders when the app is built statically (output: 'export')
 * and the `redirect` function is used to redirect to the default locale.
 */
export default function RootPage() {
  redirect("/en");
}
