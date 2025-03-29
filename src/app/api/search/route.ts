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
 * https://docs.orama.com/open-source/supported-languages/using-chinese-with-orama
 */
const searchAPI = createI18nSearchAPI('advanced', {
  // Pass the i18n config for proper language detection
  i18n: docsI18nConfig,

  // Get all pages from all languages and map them to search indexes
  indexes: source.getLanguages().flatMap(({ language, pages }) =>
    pages.map((page) => ({
      title: page.data.title,
      description: page.data.description,
      structuredData: page.data.structuredData,
      id: page.url,
      url: page.url,
      locale: language,
    })),
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

/**
 * 1. Wrap the GET handler for debugging docs search
 * 2. Detect locale from referer header, and add the locale parameter to the search API
 * 3. Fumadocs core searchAPI get `locale` from searchParams, and pass it to the search API
 * https://github.com/fuma-nama/fumadocs/blob/dev/packages/core/src/search/orama/create-endpoint.ts#L19
 */
export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || '';
  let locale = url.searchParams.get('locale') || docsI18nConfig.defaultLanguage;

  // detect locale from referer header
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      console.log('search, referer pathname:', refererUrl.pathname);
      const refererPathParts = refererUrl.pathname.split('/').filter(Boolean);
      console.log('search, referer path parts:', refererPathParts);
      if (refererPathParts.length > 0 && docsI18nConfig.languages.includes(refererPathParts[0])) {
        locale = refererPathParts[0];
        console.log(`search, detected locale from referer: ${locale}`);
      }
    } catch (e) {
      console.error('search, error parsing referer:', e);
    }
  }

  console.log(`search, request: query="${query}", detected locale="${locale}"`);

  // ensure locale parameter is passed to search API
  const searchUrl = new URL(url);
  searchUrl.searchParams.set('locale', locale);

  const modifiedRequest = new Request(searchUrl, {
    headers: request.headers,
    method: request.method,
    body: request.body,
    cache: request.cache,
    credentials: request.credentials,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    signal: request.signal,
  });

  const response = await searchAPI.GET(modifiedRequest);
  return response;
};
