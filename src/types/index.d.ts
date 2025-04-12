import type { ReactNode } from 'react';
import type { PaymentConfig } from '@/payment/types';

/**
 * website config, without translations
 */
export type WebsiteConfig = {
  theme: "default" | "blue" | "green" | "amber" | "neutral" | "default-scaled" | "blue-scaled" | "mono-scaled";
  metadata: {
    image?: string;
  };
  logo: {
    light?: string;
    dark?: string;
  };
  mail: {
    from?: string;
    to?: string;
  };
  blog: {
    paginationSize: number;
    relatedPostsSize: number;
  };
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
  payment: PaymentConfig;
};

/**
 * menu item
 * 
 * title: the text to display
 * description?: the description of the item
 * icon?: the icon to display
 * href?: the url to link to
 * external?: whether the link is external
 * authorizeOnly?: the roles that are authorized to see the item
 */
export type MenuItem = {
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  external?: boolean;
  authorizeOnly?: string[];
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
  authorizeOnly?: string[];
  items?: MenuItem[];
};
