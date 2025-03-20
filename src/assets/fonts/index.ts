import { DM_Mono, DM_Sans, DM_Serif_Text } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * This file shows how to customize the font by using local font or google font
 *
 * [1] use local font
 *
 * 1. Get font file from https://gwfh.mranftl.com/fonts
 * 2. Add font file to the assets/fonts folder
 * 3. Add font variable to the font object
 */
// https://gwfh.mranftl.com/fonts/bricolage-grotesque?subsets=latin
export const fontBricolageGrotesque = localFont({
  src: './bricolage-grotesque-v7-latin-regular.woff2',
  variable: '--font-bricolage-grotesque',
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
export const fontDMSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['500', '600', '700'],
});

export const fontDMMono = DM_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-mono',
  weight: ['300', '400', '500'],
});

export const fontDMSerifText = DM_Serif_Text({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif-text',
  weight: ['400'],
});
