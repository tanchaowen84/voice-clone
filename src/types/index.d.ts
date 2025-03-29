import type { ReactNode } from 'react';

/**
 * website config, without translations
 */
export type WebsiteConfig = {
  theme: "default" | "blue" | "green" | "amber" | "default-scaled" | "blue-scaled" | "mono-scaled";
  metadata: {
    image?: string;
  };
  mail: {
    from?: string;
    to?: string;
  }
  social: {
    twitter?: string;
    github?: string;
    blueSky?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
};

/**
 * menu item
 * 
 * title: the text to display
 * description?: the description of the item
 * icon?: the icon to display
 * href?: the url to link to
 * external?: whether the link is external
 */
export type MenuItem = {
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  external?: boolean;
};

/**
 * nested menu item, used for navbar links, sidebar links, footer links
 */
export type NestedMenuItem = {
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  external?: boolean;
  items?: MenuItem[];
};
