import { DEFAULT_LOCALE, LOCALES } from "@/i18n/routing";
import { defineCollection, defineConfig } from "@content-collections/core";
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
  schema: createDocSchema,
  transform: transformMDX,
});

const metas = defineCollection({
  name: 'meta',
  directory: 'content/docs',
  include: '**/meta.json',
  parser: 'json',
  schema: createMetaSchema,
});

/**
 * Blog Author collection
 * 
 * Authors are identified by their slug across all languages
 */
export const authors = defineCollection({
  name: 'author',
  directory: 'content',
  include: '**/author/*.mdx',
  schema: (z) => ({
    slug: z.string(),
    name: z.string(),
    avatar: z.string(),
    locale: z.enum(LOCALES as [string, ...string[]]).optional()
  }),
  transform: async (data, context) => {
    // Determine the locale from the file path or use the provided locale
    const pathParts = data._meta.path.split(path.sep);
    const localeFromPath = LOCALES.includes(pathParts[0]) ? pathParts[0] : null;
    const locale = data.locale || localeFromPath || DEFAULT_LOCALE;
    
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
 */
export const categories = defineCollection({
  name: 'category',
  directory: 'content',
  include: '**/category/*.mdx',
  schema: (z) => ({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    locale: z.enum(LOCALES as [string, ...string[]]).optional()
  }),
  transform: async (data, context) => {
    // Determine the locale from the file path or use the provided locale
    const pathParts = data._meta.path.split(path.sep);
    const localeFromPath = LOCALES.includes(pathParts[0]) ? pathParts[0] : null;
    const locale = data.locale || localeFromPath || DEFAULT_LOCALE;
    
    return {
      ...data,
      locale
    };
  }
});

/**
 * Blog Post collection
 * 
 * 1. For a blog post at content/en/blog/first-post.mdx:
 * locale: en
 * slug: /blog/first-post
 * slugAsParams: first-post
 * 
 * 2. For a blog post at content/zh/blog/first-post.mdx:
 * locale: zh
 * slug: /blog/first-post
 * slugAsParams: first-post
 */
export const posts = defineCollection({
  name: 'post',
  directory: 'content',
  include: '**/blog/**/*.mdx',
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
    
    // Determine the locale from the file path or use the provided locale
    const pathParts = data._meta.path.split(path.sep);
    const localeFromPath = LOCALES.includes(pathParts[0]) ? pathParts[0] : null;
    const locale = data.locale || localeFromPath || DEFAULT_LOCALE;
    
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
    
    // Create a slug without the locale in the path
    let slugPath = data._meta.path;
    if (localeFromPath) {
      // Remove the locale from the path for the slug
      const pathWithoutLocale = pathParts.slice(1).join(path.sep);
      slugPath = pathWithoutLocale;
    }
    
    // Create slugAsParams without the locale
    const slugParamsParts = slugPath.split(path.sep).slice(1);
    const slugAsParams = slugParamsParts.join('/');
    
    // Calculate estimated reading time
    const wordCount = data.content.split(/\s+/).length;
    const wordsPerMinute = 200; // average reading speed: 200 words per minute
    const estimatedTime = Math.max(Math.ceil(wordCount / wordsPerMinute), 1);
    
    return {
      ...data,
      locale,
      author: blogAuthor,
      categories: blogCategories,
      slug: `/${slugPath}`,
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
 * 1. For a page at content/en/pages/privacy-policy.md:
 * locale: en
 * slug: /pages/privacy-policy
 * slugAsParams: privacy-policy
 * 
 * 2. For a page at content/zh/pages/privacy-policy.md:
 * locale: zh
 * slug: /pages/privacy-policy
 * slugAsParams: privacy-policy
 */
export const pages = defineCollection({
  name: 'page',
  directory: 'content',
  include: '**/pages/**/*.{md,mdx}',
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
    
    // Determine the locale from the file path or use the provided locale
    const pathParts = data._meta.path.split(path.sep);
    const localeFromPath = LOCALES.includes(pathParts[0]) ? pathParts[0] : null;
    const locale = data.locale || localeFromPath || DEFAULT_LOCALE;
    
    // Create a slug without the locale in the path
    let slugPath = data._meta.path;
    if (localeFromPath) {
      // Remove the locale from the path for the slug
      const pathWithoutLocale = pathParts.slice(1).join(path.sep);
      slugPath = pathWithoutLocale;
    }
    
    // Create slugAsParams without the locale
    const slugParamsParts = slugPath.split(path.sep).slice(1);
    const slugAsParams = slugParamsParts.join('/');
    
    return {
      ...data,
      locale,
      slug: `/${slugPath}`,
      slugAsParams,
      body: transformedData.body,
      toc: transformedData.toc
    };
  }
});

/**
 * Releases collection for changelog
 * 
 * 1. For a release at content/en/release/v1-0-0.md:
 * locale: en
 * slug: /release/v1-0-0
 * slugAsParams: v1-0-0
 * 
 * 2. For a release at content/zh/release/v1-0-0.md:
 * locale: zh
 * slug: /release/v1-0-0
 * slugAsParams: v1-0-0
 */
export const releases = defineCollection({
  name: 'release',
  directory: 'content',
  include: '**/release/**/*.{md,mdx}',
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
    
    // Determine the locale from the file path or use the provided locale
    const pathParts = data._meta.path.split(path.sep);
    const localeFromPath = LOCALES.includes(pathParts[0]) ? pathParts[0] : null;
    const locale = data.locale || localeFromPath || DEFAULT_LOCALE;
    
    // Create a slug without the locale in the path
    let slugPath = data._meta.path;
    if (localeFromPath) {
      // Remove the locale from the path for the slug
      const pathWithoutLocale = pathParts.slice(1).join(path.sep);
      slugPath = pathWithoutLocale;
    }
    
    // Create slugAsParams without the locale
    const slugParamsParts = slugPath.split(path.sep).slice(1);
    const slugAsParams = slugParamsParts.join('/');
    
    return {
      ...data,
      locale,
      slug: `/${slugPath}`,
      slugAsParams,
      body: transformedData.body,
      toc: transformedData.toc
    };
  }
});

export default defineConfig({
  collections: [docs, metas, authors, categories, posts, pages, releases]
});