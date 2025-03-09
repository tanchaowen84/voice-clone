import { type MetadataRoute } from 'next';
import { getWebsiteInfo } from '@/config';
import { createTranslator } from '@/i18n/translator';

/**
 * Generates the Web App Manifest for the application
 *
 * ref: https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/app/manifest.ts
 *
 * The manifest.json provides metadata used when the web app is installed on a
 * user's mobile device or desktop. See https://web.dev/add-manifest/
 *
 * @returns {MetadataRoute.Manifest} The manifest configuration object
 */
export default function manifest(): MetadataRoute.Manifest {
  // Create a simple translator function for default values
  const t = createTranslator((key: string) => key);
  const websiteInfo = getWebsiteInfo(t);
  
  return {
    name: websiteInfo.name,
    short_name: websiteInfo.name,
    description: websiteInfo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
