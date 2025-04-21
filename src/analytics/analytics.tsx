import DataFastAnalytics from './data-fast-analytics';
import GoogleAnalytics from './google-analytics';
import OpenPanelAnalytics from './open-panel-analytics';
import { PlausibleAnalytics } from './plausible-analytics';
import { SelineAnalytics } from './seline-analytics';
import { UmamiAnalytics } from './umami-analytics';

/**
 * Analytics Components all in one
 *
 * 1. all the analytics components only work in production
 * 2. only work if the environment variable for the analytics is set
 *
 * docs:
 * https://mksaas.com/docs/analytics
 */
export function Analytics() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* google analytics */}
      <GoogleAnalytics />

      {/* umami analytics */}
      <UmamiAnalytics />

      {/* plausible analytics */}
      <PlausibleAnalytics />

      {/* datafast analytics */}
      <DataFastAnalytics />

      {/* openpanel analytics */}
      <OpenPanelAnalytics />

      {/* seline analytics */}
      <SelineAnalytics />
    </>
  );
}
