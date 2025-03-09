import type { Icons } from '@/components/icons/icons';
import type { ReactNode } from 'react';

/**
 * site config
 */
export type SiteConfig = {
  name: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  mail: string;
};

export type MenuItem = {
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  external?: boolean;
};

export type NestedMenuItem = {
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  external?: boolean;
  items?: MenuItem[];
};
