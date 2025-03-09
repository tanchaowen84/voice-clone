import type { ReactNode } from 'react';

/**
 * website config, without translations
 */
export type WebsiteConfig = {
  image: string;
  mail: string;
};

/**
 * website info, with translations
 */
export type WebsiteInfo = {
  name: string;
  title: string;
  tagline: string;
  description: string;
};

/**
 * menu item
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
