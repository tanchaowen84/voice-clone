"use client";

import Script from "next/script";

/**
 * Seline Analytics
 * 
 * https://app.seline.com
 */
export function SelineAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const token = process.env.NEXT_PUBLIC_SELINE_TOKEN as string;
  if (!token) {
    return null;
  }

  return (
    <Script async src="https://cdn.seline.com/seline.js" data-token={token} />
  );
}
