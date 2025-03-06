import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode, { Options } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { codeImport } from 'remark-code-import';
import remarkGfm from 'remark-gfm';
import { createHighlighter } from 'shiki';
import path from "path";
import { getBaseUrl } from "@/lib/urls/get-base-url";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/routing";

/**
 * Content Collections documentation
 * 1. https://www.content-collections.dev/docs/quickstart/next
 * 2. https://www.content-collections.dev/docs/configuration
 * 3. https://www.content-collections.dev/docs/transform#join-collections
 */

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
      avatar: getBaseUrl() + data.avatar
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
    const body = await compileMDX(context, data, {
      remarkPlugins: [
        remarkGfm,
        codeImport
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        [rehypePrettyCode, prettyCodeOptions]
      ]
    });
    
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
      image: getBaseUrl() + data.image,
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

export default defineConfig({
  collections: [authors, categories, posts]
});