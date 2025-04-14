import GoogleAnalytics from "./google-analytics";
import { UmamiAnalytics } from "./umami-analytics";
import { PlausibleAnalytics } from "./plausible-analytics";
import DataFastAnalytics from "./data-fast-analytics";
import OpenPanelAnalytics from "./open-panel-analytics";
import { SelineAnalytics } from "./seline-analytics";

/**
 * Analytics Components all in one
 *
 * 1. all the analytics components only work in production
 * 2. only work if the environment variable for the analytics is set
 */
export function Analytics() {
  if (process.env.NODE_ENV !== "production") {
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
