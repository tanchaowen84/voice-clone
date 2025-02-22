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

/**
 * Content Collections documentation
 * 1. https://www.content-collections.dev/docs/quickstart/next
 * 2. https://www.content-collections.dev/docs/configuration
 * 3. https://www.content-collections.dev/docs/transform#join-collections
 */

/**
 * Blog Author collection
 */
export const authors = defineCollection({
  name: 'author',
  directory: 'content',
  include: '**/author/*.mdx',
  schema: (z) => ({
    slug: z.string(),
    name: z.string(),
    avatar: z.string()
  }),
  transform: async (data, context) => {
    return {
      ...data,
      avatar: getBaseUrl() + data.avatar
    };
  }
});

/**
 * Blog Category collection
 */
export const categories = defineCollection({
  name: 'category',
  directory: 'content',
  include: '**/category/*.mdx',
  schema: (z) => ({
    slug: z.string(),
    name: z.string(),
    description: z.string()
  })
});

/**
 * Blog Post collection
 * 
 * 1. For a blog post file at content/blog/2023/year-review.mdx:
 * slug: /blog/2023/year-review
 * slugAsParams: 2023/year-review
 * 
 * 2. For a blog post at content/blog/first-post.mdx:
 * slug: /blog/first-post
 * slugAsParams: first-post
 */
export const posts = defineCollection({
  name: 'post',
  directory: 'content',
  include: '**/blog/*.mdx',
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    date: z.string().datetime(),
    published: z.boolean().default(true),
    categories: z.array(z.string()),
    author: z.string()
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
    const blogAuthor = context
      .documents(authors)
      .find((a) => a.slug === data.author);
    const blogCategories = context
      .documents(categories)
      .filter((c) => data.categories.includes(c.slug));
    return {
      ...data,
      author: blogAuthor,
      categories: blogCategories,
      image: getBaseUrl() + data.image,
      slug: `/${data._meta.path}`,
      slugAsParams: data._meta.path.split(path.sep).slice(1).join('/'),
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