import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { withContentCollections } from "@content-collections/next";

/**
 * https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#next-config
 */
const withNextIntl = createNextIntlPlugin();

/**
 * https://nextjs.org/docs/app/api-reference/config/next-config-js
 */
const nextConfig: NextConfig = {
  /* config options here */
  
  // https://nextjs.org/docs/architecture/nextjs-compiler#remove-console
  // Remove all console.* calls in production only
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    // https://vercel.com/docs/image-optimization/managing-image-optimization-costs#minimizing-image-optimization-costs
    // vercel has limits on image optimization, 1000 images per month
    // unoptimized: true,
    
    // https://medium.com/@niniroula/nextjs-upgrade-next-image-and-dangerouslyallowsvg-c934060d79f8
    // The requested resource "https://cdn.sanity.io/images/58a2mkbj/preview/xxx.svg?fit=max&auto=format" has type "image/svg+xml"
    // but dangerouslyAllowSVG is disabled
    // dangerouslyAllowSVG: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

/**
 * withContentCollections must be the outermost plugin
 * 
 * https://www.content-collections.dev/docs/quickstart/next
 */
export default withContentCollections(withNextIntl(nextConfig));
