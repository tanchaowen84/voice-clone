import { MetadataRoute } from 'next';
import { routing, Locale } from '@/i18n/routing';
import { getLocalePathname } from '@/i18n/navigation';
import { siteConfig } from './config/site';

export default function sitemap(): MetadataRoute.Sitemap {
    return [...getEntries('/')];
}

type Href = Parameters<typeof getLocalePathname>[0]['href'];

/**
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#sitemap
 * https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/app/sitemap.ts
 */
function getEntries(href: Href) {
    return routing.locales.map((locale) => ({
        url: getUrl(href, locale),
        alternates: {
            languages: Object.fromEntries(
                routing.locales.map((cur) => [cur, getUrl(href, cur)])
            )
        }
    }));
}

function getUrl(href: Href, locale: Locale) {
    const pathname = getLocalePathname({ locale, href });
    return siteConfig.url + pathname;
}