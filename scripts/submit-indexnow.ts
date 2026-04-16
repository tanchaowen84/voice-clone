import {
  allCategories,
  allPosts,
} from '../.content-collections/generated/index.js';
import { websiteConfig } from '../src/config/website';
import { routing } from '../src/i18n/routing';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY = '67113058df4248ce8ad3b2142ccf30ab';

const STATIC_INDEXABLE_ROUTES = [
  '/',
  '/tools/audio-enhancer',
  '/tools/echo-remover-ai',
  '/tools/online-voice-recorder',
  '/tools/mic-test-online',
] as const;

type CliOptions = {
  baseUrl: string;
  dryRun: boolean;
};

function parseCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  let dryRun = false;

  for (const arg of args) {
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg.startsWith('--base-url=')) {
      baseUrl = arg.slice('--base-url='.length);
      continue;
    }

    throw new Error(`Unsupported argument: ${arg}`);
  }

  if (!baseUrl) {
    throw new Error(
      'Missing base URL. Pass --base-url=https://voice-clone.org or set NEXT_PUBLIC_BASE_URL.'
    );
  }

  const parsedBaseUrl = new URL(baseUrl);
  parsedBaseUrl.pathname = '/';
  parsedBaseUrl.search = '';
  parsedBaseUrl.hash = '';

  return {
    baseUrl: parsedBaseUrl.toString().replace(/\/$/, ''),
    dryRun,
  };
}

function getLocalizedPath(locale: string, pathname: string): string {
  if (locale === routing.defaultLocale) {
    return pathname;
  }

  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}

function collectIndexableUrls(baseUrl: string): string[] {
  const urls = new Set<string>();

  for (const locale of routing.locales) {
    for (const route of STATIC_INDEXABLE_ROUTES) {
      urls.add(
        new URL(getLocalizedPath(locale, route), `${baseUrl}/`).toString()
      );
    }

    const localePosts = allPosts.filter(
      (post) => post.locale === locale && post.published
    );
    const totalBlogPages = Math.ceil(
      localePosts.length / websiteConfig.blog.paginationSize
    );

    for (let page = 2; page <= totalBlogPages; page++) {
      urls.add(
        new URL(
          getLocalizedPath(locale, `/blog/page/${page}`),
          `${baseUrl}/`
        ).toString()
      );
    }

    const localeCategories = allCategories.filter(
      (category) => category.locale === locale
    );

    for (const category of localeCategories) {
      const postsInCategory = localePosts.filter((post) =>
        post.categories.some(
          (linkedCategory) => linkedCategory?.slug === category.slug
        )
      );

      if (postsInCategory.length === 0) {
        continue;
      }

      urls.add(
        new URL(
          getLocalizedPath(locale, `/blog/category/${category.slug}`),
          `${baseUrl}/`
        ).toString()
      );

      const totalCategoryPages = Math.ceil(
        postsInCategory.length / websiteConfig.blog.paginationSize
      );

      for (let page = 2; page <= totalCategoryPages; page++) {
        urls.add(
          new URL(
            getLocalizedPath(
              locale,
              `/blog/category/${category.slug}/page/${page}`
            ),
            `${baseUrl}/`
          ).toString()
        );
      }
    }

    for (const post of localePosts) {
      urls.add(
        new URL(getLocalizedPath(locale, post.slug), `${baseUrl}/`).toString()
      );
    }
  }

  return [...urls];
}

async function submitIndexNow() {
  const { baseUrl, dryRun } = parseCliOptions();
  const urlList = collectIndexableUrls(baseUrl);

  if (urlList.length === 0) {
    throw new Error('No indexable URLs found for IndexNow submission.');
  }

  const payload = {
    host: new URL(baseUrl).host,
    key: INDEXNOW_KEY,
    keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  if (dryRun) {
    console.log(`IndexNow dry run: ${urlList.length} URLs`);
    for (const url of urlList) {
      console.log(url);
    }
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      `IndexNow request failed with ${response.status}: ${body || 'empty response body'}`
    );
  }

  console.log(`IndexNow submitted successfully: ${urlList.length} URLs`);
  console.log(JSON.stringify(payload, null, 2));
  if (body) {
    console.log(body);
  }
}

submitIndexNow().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
