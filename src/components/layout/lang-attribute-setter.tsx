"use client";

import { useEffect } from "react";

interface LangAttributeSetterProps {
  locale: string;
}

/**
 * Client component that sets the lang attribute on the html element
 * This is necessary because we can't set the lang attribute directly in the [locale] layout
 * as it would create nested html tags, and we can't set the lang attribute in the root layout
 * as it can't get the locale there.
 */
export function LangAttributeSetter({ locale }: LangAttributeSetterProps) {
  useEffect(() => {
    // Set the lang attribute on the html element
    document.documentElement.lang = locale;
  }, [locale]);

  // This component doesn't render anything
  return null;
}