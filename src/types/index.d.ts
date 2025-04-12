import type { ReactNode } from 'react';

/**
 * website config, without translations
 */
export type WebsiteConfig = {
  metadata: WebsiteMetadata;
  i18n: I18nConfig;
  blog: BlogConfig;
  mail: MailConfig;
  newsletter: NewsletterConfig;
  storage: StorageConfig;
  payment: PaymentConfig;
};

/**
 * Website metadata
 */
export interface WebsiteMetadata {
  theme?: "default" | "blue" | "green" | "amber" | "neutral" | "default-scaled" | "blue-scaled" | "mono-scaled"; // The theme
  ogImage?: string;                     // The image as Open Graph image
  logoLight?: string;                   // The light logo image
  logoDark?: string;                    // The dark logo image
  social: SocialConfig;                 // The social media configuration
}

/**
 * Social media configuration
 */
export interface SocialConfig {
  twitter?: string;
  github?: string;
  blueSky?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

/**
 * I18n configuration
 */
export interface I18nConfig {
  defaultLocale: string;
  locales: Record<string, { flag?: string; name: string }>;
}

/**
 * Blog configuration
 */
export interface BlogConfig {
  paginationSize: number;            // Number of posts per page
  relatedPostsSize: number;          // Number of related posts to show
}

/**
 * Mail configuration
 */
export interface MailConfig {
  provider: 'resend';                // The email provider, only resend is supported for now
  from?: string;                     // Sender email address
  to?: string;                       // Recipient email address
}

/**
 * Newsletter configuration
 */
export interface NewsletterConfig {
  provider: 'resend';                // The newsletter provider, only resend is supported for now
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  provider: 's3';                    // The storage provider, only s3 is supported for now
}

/**
 * Payment configuration
 */
export interface PaymentConfig {
  provider: 'stripe';                // The payment provider, only stripe is supported for now
  plans: Record<string, PricePlan>;  // Plans indexed by ID
}

/**
 * menu item, used for navbar links, sidebar links, footer links
 */
export type MenuItem = {
  title: string;                      // The text to display
  description?: string;               // The description of the item
  icon?: ReactNode;                   // The icon to display
  href?: string;                      // The url to link to
  external?: boolean;                 // Whether the link is external
  authorizeOnly?: string[];           // The roles that are authorized to see the item
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
  items?: MenuItem[];                // The items to display in the nested menu
};
