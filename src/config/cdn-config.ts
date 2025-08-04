/**
 * CDN Configuration for Static Assets
 * 
 * This configuration manages the CDN URLs for static assets
 * to improve loading performance and reduce server load.
 */

/**
 * CDN base URL for static assets
 * Set to your Cloudflare R2 custom domain
 */
export const CDN_BASE_URL = 'https://cdn.voice-clone.org';

/**
 * Static assets that should be served from CDN
 * These assets will be prefixed with CDN_BASE_URL
 */
export const CDN_ASSETS = {
  // Favicon and app icons
  favicon: '/favicon.ico',
  favicon16: '/favicon-16x16.png',
  favicon32: '/favicon-32x32.png',
  
  // Logo assets
  logoLight: '/logo.png',
  logoDark: '/logo-dark.png',
  
  // Feature images
  features1: '/features1.png',
  features2: '/features2.png',
  features3: '/features3.png',
  features4: '/features4.png',
  
  // Marketing images
  howitworks: '/howitworks.png',
  aicapabilities: '/aicapabilities.png',
  
  // OG image
  ogImage: '/og.png',
} as const;

/**
 * Get CDN URL for a static asset
 * @param assetPath - The asset path (with leading slash)
 * @returns Full CDN URL for the asset
 */
export function getCDNUrl(assetPath: string): string {
  // If it's already a full URL, return as is
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }
  
  // Remove leading slash if present for consistency
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  
  return `${CDN_BASE_URL}/${cleanPath}`;
}

/**
 * Get asset URL with CDN support
 * Falls back to local path if CDN is not available
 * @param assetKey - Key from CDN_ASSETS or custom path
 * @param useCDN - Whether to use CDN (default: true in production)
 * @returns Asset URL
 */
export function getAssetUrl(
  assetKey: keyof typeof CDN_ASSETS | string, 
  useCDN: boolean = process.env.NODE_ENV === 'production'
): string {
  // If it's a predefined CDN asset
  if (assetKey in CDN_ASSETS) {
    const assetPath = CDN_ASSETS[assetKey as keyof typeof CDN_ASSETS];
    return useCDN ? getCDNUrl(assetPath) : assetPath;
  }
  
  // If it's a custom path
  if (typeof assetKey === 'string') {
    return useCDN ? getCDNUrl(assetKey) : assetKey;
  }
  
  return assetKey;
}

/**
 * Check if an asset should use CDN
 * @param assetPath - The asset path
 * @returns Whether the asset should use CDN
 */
export function shouldUseCDN(assetPath: string): boolean {
  // Don't use CDN for external URLs
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return false;
  }
  
  // Check if it's one of our CDN assets
  return Object.values(CDN_ASSETS).includes(assetPath as any);
}

/**
 * Environment-based CDN configuration
 */
export const CDN_CONFIG = {
  enabled: process.env.NODE_ENV === 'production',
  baseUrl: CDN_BASE_URL,
  fallbackToLocal: true,
} as const;
