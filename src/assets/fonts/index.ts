import localFont from 'next/font/local';
import { Source_Serif_4 } from 'next/font/google';

/**
 * This file shows how to customize the font by using local font or google font
 *
 * [1] use local font
 *
 * 1. Get font file from https://gwfh.mranftl.com/fonts
 * 2. Add font file to the assets/fonts folder
 * 3. Add font variable to the font object
 */
// https://gwfh.mranftl.com/fonts/source-sans-3?subsets=latin
export const fontSourceSans = localFont({
  src: './source-sans-3-v15-latin-regular.woff2',
  variable: '--font-source-sans',
});

// https://gwfh.mranftl.com/fonts/dm-sans?subsets=latin
export const fontDMSans = localFont({
  src: './dm-sans-v15-latin-regular.woff2',
  variable: '--font-dm-sans',
});

/**
 * [2] use google font
 *
 * 1. You can browser fonts at Google Fonts
 * https://fonts.google.com
 *
 * 2. CSS and font files are downloaded at build time and self-hosted with the rest of your static assets.
 * https://nextjs.org/docs/app/building-your-application/optimizing/fonts#google-fonts
 */
export const fontSourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
});
