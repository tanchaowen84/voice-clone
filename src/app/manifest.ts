import { type MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/**
 * Generates the Web App Manifest for the application
 * 
 * TODO: https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/app/manifest.ts
 * 
 * The manifest.json provides metadata used when the web app is installed on a
 * user's mobile device or desktop. See https://web.dev/add-manifest/
 * 
 * @returns {MetadataRoute.Manifest} The manifest configuration object
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
