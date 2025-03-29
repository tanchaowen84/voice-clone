import { source } from '@/lib/docs/source';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import { createI18nSearchAPI } from 'fumadocs-core/search/server';
import { docsI18nConfig } from '@/lib/docs/i18n';

/**
 * Fumadocs i18n search configuration
 * 
 * 1. For internationalization, use createI18nSearchAPI:
 * https://fumadocs.vercel.app/docs/headless/search/orama#internationalization
 * 
 * 2. For special languages like Chinese, configure custom tokenizers:
 * https://fumadocs.vercel.app/docs/headless/search/orama#special-languages
 */
export const { GET } = createI18nSearchAPI('advanced', {
  // Pass the i18n config for proper language detection
  i18n: docsI18nConfig,
  
  // Get all pages from all languages and map them to search indexes
  indexes: source.getLanguages().flatMap(({ language, pages }) =>
    pages.map((page) => {
      return {
        title: page.data.title,
        description: page.data.description,
        structuredData: page.data.structuredData,
        id: page.url,
        url: page.url,
        // Set the locale explicitly for each page
        locale: language,
      };
    }),
  ),
  
  // Configure special language tokenizers and search options
  localeMap: {
    // Chinese configuration with Mandarin tokenizer
    zh: {
      components: {
        tokenizer: createTokenizer(),
      },
      search: {
        // Lower threshold for better matches with Chinese text
        threshold: 0,
        // Lower tolerance for better precision
        tolerance: 0,
      },
    },
    
    // Use the default English tokenizer for English content
    en: 'english',
  },
  
  // Global search configuration
  search: {
    limit: 20,
  },
});
