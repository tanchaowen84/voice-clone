import { allDocs, allMetas } from 'content-collections';
import { loader } from 'fumadocs-core/source';
import { createMDXSource } from '@fumadocs/content-collections';
import { docsI18nConfig } from './i18n';

export const source = loader({
  baseUrl: '/docs',
  i18n: docsI18nConfig,
  source: createMDXSource(allDocs, allMetas),
});
