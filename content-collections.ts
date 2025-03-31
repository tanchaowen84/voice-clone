import { DEFAULT_LOCALE, LOCALES } from "@/i18n/routing";
import { defineCollection, defineConfig, z } from "@content-collections/core";
import {
  createDocSchema,
  createMetaSchema,
  transformMDX,
} from '@fumadocs/content-collections/configuration';
import path from "path";

/**
 * Content Collections documentation
 * 1. https://www.content-collections.dev/docs/quickstart/next
 * 2. https://www.content-collections.dev/docs/configuration
 * 3. https://www.content-collections.dev/docs/transform#join-collections
 */

/**
 * Use Content Collections for Fumadocs
 * https://fumadocs.vercel.app/docs/headless/content-collections
 */
const docs = defineCollection({
  name: 'docs',
  directory: 'content/docs',
  include: '**/*.mdx',
  schema: (z) => ({
    ...createDocSchema(z),
    preview: z.string().optional(),
    index: z.boolean().default(false),
  }),
  transform: transformMDX,
});

const metas = defineCollection({
  name: 'meta',
  directory: 'content/docs',
  include: '**/meta**.json',
  parser: 'json',
  schema: createMetaSchema,
});

/**
 * Blog Author collection
 * 
 * Authors are identified by their slug across all languages
 * New format: content/author/authorname.{locale}.mdx
 * Example: content/author/mksaas.mdx (default locale) and content/author/mksaas.zh.mdx (Chinese)
 */
export const authors = defineCollection({
  name: 'author',
  directory: 'content/author',
  include: '**/*.mdx',
  schema: (z) => ({
    slug: z.string(),
    name: z.string(),
    avatar: z.string(),
    locale: z.enum(LOCALES as [string, ...string[]]).optional()
  }),
  transform: async (data, context) => {
    // Determine the locale from the file name or use the provided locale
    const fileName = data._meta.path.split(path.sep).pop() || '';
    const fileNameParts = fileName.split('.');
    
    // Check if the file has a locale suffix (e.g., mksaas.zh.mdx)
    let localeFromFileName = null;
    if (fileNameParts.length > 2) {
      const possibleLocale = fileNameParts[fileNameParts.length - 2];
      if (LOCALES.includes(possibleLocale)) {
        localeFromFileName = possibleLocale;
      }
    }
    
    const locale = data.locale || localeFromFileName || DEFAULT_LOCALE;
    
    return {
      ...data,
      locale,
    };
  }
});

/**
 * Blog Category collection
 * 
 * Categories are identified by their slug across all languages
 * New format: content/category/categoryname.{locale}.mdx
 * Example: content/category/tutorial.mdx (default locale) and content/category/tutorial.zh.mdx (Chinese)
 */
export const categories = defineCollection({
  name: 'category',
  directory: 'content/category',
  include: '**/*.mdx',
  schema: (z) => ({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    locale: z.enum(LOCALES as [string, ...string[]]).optional()
  }),
  transform: async (data, context) => {
    // Determine the locale from the file name or use the provided locale
    const fileName = data._meta.path.split(path.sep).pop() || '';
    const fileNameParts = fileName.split('.');
    
    // Check if the file has a locale suffix (e.g., tutorial.zh.mdx)
    let localeFromFileName = null;
    if (fileNameParts.length > 2) {
      const possibleLocale = fileNameParts[fileNameParts.length - 2];
      if (LOCALES.includes(possibleLocale)) {
        localeFromFileName = possibleLocale;
      }
    }
    
    const locale = data.locale || localeFromFileName || DEFAULT_LOCALE;
    
    return {
      ...data,
      locale
    };
  }
});

/**
 * Helper function to extract the file basename, locale, and extension
 * @param fileName The file name to parse
 * @returns Object with base, locale, and extension
 */
function parseFileName(fileName: string): { base: string; locale: string | null; ext: string } {
  // Split the filename into parts
  const parts = fileName.split('.');
  
  // Handle different cases based on the number of parts
  if (parts.length === 1) {
    // Filename with no extension (unlikely)
    return { base: parts[0], locale: null, ext: '' };
  } else if (parts.length === 2) {
    // Regular filename with extension: example.mdx
    return { base: parts[0], locale: null, ext: parts[1] };
  } else {
    // Check if the second-to-last part is a locale
    const possibleLocale = parts[parts.length - 2];
    const isLocale = LOCALES.includes(possibleLocale);
    
    if (isLocale) {
      // Filename with locale: example.zh.mdx
      // Join all parts except the last two with dots to handle filenames that contain dots
      const base = parts.slice(0, parts.length - 2).join('.');
      return { base, locale: possibleLocale, ext: parts[parts.length - 1] };
    } else {
      // Filename with dots but no locale: example.something.mdx
      // Join all parts except the last one with dots
      const base = parts.slice(0, parts.length - 1).join('.');
      return { base, locale: null, ext: parts[parts.length - 1] };
    }
  }
}

/**
 * Blog Post collection
 * 
 * New format: content/blog/post-slug.{locale}.mdx
 * 
 * 1. For a blog post at content/blog/first-post.mdx (default locale):
 * locale: en
 * slug: /blog/first-post
 * slugAsParams: first-post
 * 
 * 2. For a blog post at content/blog/first-post.zh.mdx (Chinese locale):
 * locale: zh
 * slug: /blog/first-post
 * slugAsParams: first-post
 */
export const posts = defineCollection({
  name: 'post',
  directory: 'content/blog',
  include: '**/*.mdx',
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    date: z.string().datetime(),
    published: z.boolean().default(true),
    categories: z.array(z.string()),
    author: z.string(),
    locale: z.enum(LOCALES as [string, ...string[]]).optional(),
    estimatedTime: z.number().optional() // Reading time in minutes
  }),
  transform: async (data, context) => {
    // Use Fumadocs transformMDX for consistent MDX processing
    const transformedData = await transformMDX(data, context);
    
    // Get the filename from the path
    const fileName = data._meta.path.split(path.sep).pop() || '';
    
    // Parse the filename into base, locale, and extension
    const { base, locale: localeFromFileName, ext } = parseFileName(fileName);
    
    // Use the locale from the file name or fall back to default
    const locale = data.locale || localeFromFileName || DEFAULT_LOCALE;
    
    // Find the author by matching slug
    const blogAuthor = context
      .documents(authors)
      .find((a) => a.slug === data.author && a.locale === locale) || 
      context
      .documents(authors)
      .find((a) => a.slug === data.author);
    
    // Find categories by matching slug
    const blogCategories = data.categories.map(categorySlug => {
      // Try to find a category with matching slug and locale
      const category = context
        .documents(categories)
        .find(c => c.slug === categorySlug && c.locale === locale) || 
        context
        .documents(categories)
        .find(c => c.slug === categorySlug);
      
      return category;
    }).filter(Boolean); // Remove null values
    
    // Get the collection name (e.g., "blog")
    const pathParts = data._meta.path.split(path.sep);
    const collectionName = pathParts[pathParts.length - 2];
    
    // Create the slug and slugAsParams
    const slug = `/${collectionName}/${base}`;
    const slugAsParams = base;
    
    // Calculate estimated reading time
    const wordCount = data.content.split(/\s+/).length;
    const wordsPerMinute = 200; // average reading speed: 200 words per minute
    const estimatedTime = Math.max(Math.ceil(wordCount / wordsPerMinute), 1);
    
    // console.log(`Post processed: ${fileName}, slugAsParams=${slugAsParams}, slug=${slug}`);
    
    return {
      ...data,
      locale,
      author: blogAuthor,
      categories: blogCategories,
      slug,
      slugAsParams,
      estimatedTime,
      body: transformedData.body, // Use processed MDX content directly
      toc: transformedData.toc
    };
  }
});

/**
 * Pages collection for policy pages like privacy-policy, terms-of-service, etc.
 * 
 * New format: content/pages/page-slug.{locale}.mdx
 * 
 * 1. For a page at content/pages/privacy-policy.mdx (default locale):
 * locale: en
 * slug: /pages/privacy-policy
 * slugAsParams: privacy-policy
 * 
 * 2. For a page at content/pages/privacy-policy.zh.mdx (Chinese locale):
 * locale: zh
 * slug: /pages/privacy-policy
 * slugAsParams: privacy-policy
 */
export const pages = defineCollection({
  name: 'page',
  directory: 'content/pages',
  include: '**/*.{md,mdx}',
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    date: z.string().datetime(),
    published: z.boolean().default(true),
    locale: z.enum(LOCALES as [string, ...string[]]).optional()
  }),
  transform: async (data, context) => {
    // Use Fumadocs transformMDX for consistent MDX processing
    const transformedData = await transformMDX(data, context);
    
    // Get the filename from the path
    const fileName = data._meta.path.split(path.sep).pop() || '';
    
    // Parse the filename into base, locale, and extension
    const { base, locale: localeFromFileName, ext } = parseFileName(fileName);
    
    // Use the locale from the file name or fall back to default
    const locale = data.locale || localeFromFileName || DEFAULT_LOCALE;
    
    // Get the collection name (e.g., "pages")
    const pathParts = data._meta.path.split(path.sep);
    const collectionName = pathParts[pathParts.length - 2];
    
    // Create the slug and slugAsParams
    const slug = `/${collectionName}/${base}`;
    const slugAsParams = base;
    
    // console.log(`Page processed: ${fileName}, slugAsParams=${slugAsParams}, slug=${slug}`);
    
    return {
      ...data,
      locale,
      slug,
      slugAsParams,
      body: transformedData.body,
      toc: transformedData.toc
    };
  }
});

/**
 * Releases collection for changelog
 * 
 * New format: content/release/version-slug.{locale}.mdx
 * 
 * 1. For a release at content/release/v1-0-0.mdx (default locale):
 * locale: en
 * slug: /release/v1-0-0
 * slugAsParams: v1-0-0
 * 
 * 2. For a release at content/release/v1-0-0.zh.mdx (Chinese locale):
 * locale: zh
 * slug: /release/v1-0-0
 * slugAsParams: v1-0-0
 */
export const releases = defineCollection({
  name: 'release',
  directory: 'content/release',
  include: '**/*.{md,mdx}',
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    date: z.string().datetime(),
    version: z.string(),
    published: z.boolean().default(true),
    locale: z.enum(LOCALES as [string, ...string[]]).optional()
  }),
  transform: async (data, context) => {
    // Use Fumadocs transformMDX for consistent MDX processing
    const transformedData = await transformMDX(data, context);
    
    // Get the filename from the path
    const fileName = data._meta.path.split(path.sep).pop() || '';
    
    // Parse the filename into base, locale, and extension
    const { base, locale: localeFromFileName, ext } = parseFileName(fileName);
    
    // Use the locale from the file name or fall back to default
    const locale = data.locale || localeFromFileName || DEFAULT_LOCALE;
    
    // Get the collection name (e.g., "release")
    const pathParts = data._meta.path.split(path.sep);
    const collectionName = pathParts[pathParts.length - 2];
    
    // Create the slug and slugAsParams
    const slug = `/${collectionName}/${base}`;
    const slugAsParams = base;
    
    // console.log(`Release processed: ${fileName}, slugAsParams=${slugAsParams}, slug=${slug}`);
    
    return {
      ...data,
      locale,
      slug,
      slugAsParams,
      body: transformedData.body,
      toc: transformedData.toc
    };
  }
});

export default defineConfig({
  collections: [docs, metas, authors, categories, posts, pages, releases]
});