import { createMDXSource } from '@fumadocs/content-collections';
import { allDocs, allMetas } from 'content-collections';
import { loader } from 'fumadocs-core/source';
import { docsI18nConfig } from './i18n';

/**
 * Turn a content source into a unified interface
 * 
 * https://fumadocs.vercel.app/docs/headless/source-api
 * https://fumadocs.vercel.app/docs/headless/content-collections
 */
export const source = loader({
  baseUrl: '/docs',
  i18n: docsI18nConfig,
  source: createMDXSource(allDocs, allMetas),
});