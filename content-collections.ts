import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode, { Options } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { codeImport } from 'remark-code-import';
import remarkGfm from 'remark-gfm';
import { createHighlighter } from 'shiki';
import path from "path";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/routing";
import { visit } from 'unist-util-visit';
import {
  createMetaSchema,
  createDocSchema,
  transformMDX,
} from '@fumadocs/content-collections/configuration';

/**
 * Content Collections documentation
 * 1. https://www.content-collections.dev/docs/quickstart/next
 * 2. https://www.content-collections.dev/docs/configuration
 * 3. https://www.content-collections.dev/docs/transform#join-collections
 */

/**
 * Fumadocs documentation
 * 
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
    locale: z.enum(LOCALES as [string, ...string[]]).optional()
  }),
  transform: async (data, context) => {
    const body = await compileWithCodeCopy(context, data);
    
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
    
    return {
      ...data,
      locale,
      author: blogAuthor,
      categories: blogCategories,
      slug: `/${slugPath}`,
      slugAsParams,
      body: {
        raw: data.content,
        code: body
      }
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
    const body = await compileWithCodeCopy(context, data);
    
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
      body: {
        raw: data.content,
        code: body
      }
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
    const body = await compileWithCodeCopy(context, data);
    
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
      body: {
        raw: data.content,
        code: body
      }
    };
  }
});

const prettyCodeOptions: Options = {
  theme: 'github-dark',
  getHighlighter: (options) =>
    createHighlighter({
      ...options
    }),
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and allow empty
    // lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node) {
    if (!node.properties.className) {
      node.properties.className = [];
    }
    node.properties.className.push('line--highlighted');
  },
  onVisitHighlightedChars(node) {
    if (!node.properties.className) {
      node.properties.className = [];
    }
    node.properties.className = ['word--highlighted'];
  }
};

const compileWithCodeCopy = async (
  context: any, 
  data: any, 
  options: { 
    remarkPlugins?: any[]; 
    rehypePlugins?: any[];
  } = {}
) => {
  return await compileMDX(context, data, {
    ...options,
    remarkPlugins: [
      remarkGfm,
      codeImport,
      ...(options.remarkPlugins || [])
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      // add __rawString__ to pre element
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code") return;
            
            // add __rawString__ as a property that will be passed to the React component
            if (!node.properties) {
              node.properties = {};
            }
            node.properties.__rawString__ = codeEl.children?.[0]?.value;
          }
        });
      },
      rehypeAutolinkHeadings,
      ...(options.rehypePlugins || [])
    ]
  });
};

export default defineConfig({
  collections: [docs, metas, authors, categories, posts, pages, releases]
});