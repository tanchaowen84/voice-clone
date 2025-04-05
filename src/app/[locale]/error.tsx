'use client';

import { lazy } from 'react';

/**
 * Move error content to a separate chunk and load it only when needed
 *
 * Note that error.tsx is loaded right after your app has initialized.
 * If your app is performance-sensitive and you want to avoid loading translation functionality
 * from next-intl as part of this bundle, you can export a lazy reference from your error file.
 * https://next-intl.dev/docs/environments/error-files#errorjs
 */
export default lazy(() => import('@/components/layout/error'));
