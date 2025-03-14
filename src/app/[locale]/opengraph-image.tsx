import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';
 
/**
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#open-graph-images
 */
export default async function OpenGraphImage({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'OpenGraphImage'});
  return new ImageResponse(<div style={{fontSize: 128}}>{t('title')}</div>);
}