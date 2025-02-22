import localFont from "next/font/local";

/**
 * use local font
 *
 * 1. Get font file from https://gwfh.mranftl.com/fonts
 * 2. Add font file to the assets/fonts folder
 * 3. Add font variable to the font object
 */
export const fontSourceSerif = localFont({
  src: "./source-serif-4-v8-latin-regular.woff2",
  variable: "--font-source-serif",
});

export const fontSourceSans = localFont({
  src: "./source-sans-3-v15-latin-regular.woff2",
  variable: "--font-source-sans",
});

// https://gwfh.mranftl.com/fonts/work-sans?subsets=latin
export const fontWorkSans = localFont({
  src: "./work-sans-v19-latin-regular.woff2",
  variable: "--font-work-sans",
});

// https://gwfh.mranftl.com/fonts/bricolage-grotesque?subsets=latin
export const fontBricolageGrotesque = localFont({
  src: "./bricolage-grotesque-v7-latin-regular.woff2",
  variable: "--font-bricolage",
});

/**
 * use google font
 *
 * 1. You can browser fonts at Google Fonts
 * https://fonts.google.com
 *
 * 2. CSS and font files are downloaded at build time and self-hosted with the rest of your static assets.
 * https://nextjs.org/docs/app/building-your-application/optimizing/fonts#google-fonts
 */
// export const fontSourceSerif4 = Source_Serif_4({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: "--font-source-serif",
// })
