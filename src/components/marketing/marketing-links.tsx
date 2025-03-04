import * as React from 'react';
import { CubeIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import {
  BookIcon,
  BookOpenIcon,
  CircuitBoardIcon,
  CuboidIcon,
  FileBarChartIcon,
  LayoutIcon,
  PlayIcon
} from 'lucide-react';
import { Routes } from '@/routes';
import { FacebookIcon } from '@/components/icons/facebook';
import { InstagramIcon } from '@/components/icons/instagram';
import { LinkedInIcon } from '@/components/icons/linkedin';
import { TikTokIcon } from '@/components/icons/tiktok';
import { XTwitterIcon } from '@/components/icons/x';

export const MENU_LINKS = [
  {
    title: 'Features',
    href: Routes.Pricing,
    external: false
  },
  {
    title: 'Pricing',
    href: Routes.Pricing,
    external: false
  },
  {
    title: 'Blog',
    href: Routes.Blog,
    external: false
  },
  // {
  //   title: 'Docs',
  //   href: Routes.Docs,
  //   external: false
  // },
  {
    title: 'AI',
    items: [
      {
        title: 'Features',
        description: 'Short description here',
        icon: <CubeIcon className="size-5 shrink-0" />,
        href: Routes.Features,
        external: false
      },
      {
        title: 'Pricing',
        description: 'Short description here',
        icon: <PlayIcon className="size-5 shrink-0" />,
        href: Routes.Pricing,
        external: false
      },
      {
        title: 'FAQ',
        description: 'Short description here',
        icon: <LayoutIcon className="size-5 shrink-0" />,
        href: Routes.FAQ,
        external: false
      },
      {
        title: 'Roadmap',
        description: 'Short description here',
        icon: <FileBarChartIcon className="size-5 shrink-0" />,
        href: Routes.Roadmap,
        external: true
      }
    ]
  },
  {
    title: 'Pages',
    items: [
      {
        title: 'About',
        description: 'Short description here',
        icon: <PaperPlaneIcon className="size-5 shrink-0" />,
        href: Routes.About,
        external: false
      },
      {
        title: 'Contact',
        description: 'Short description here',
        icon: <PaperPlaneIcon className="size-5 shrink-0" />,
        href: Routes.Contact,
        external: false
      },
      {
        title: 'Waitlist',
        description: 'Short description here',
        icon: <BookOpenIcon className="size-5 shrink-0" />,
        href: Routes.Waitlist,
        external: false
      }
    ]
  },
];

export const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { name: 'Feature 1', href: '#', external: false },
      { name: 'Feature 2', href: '#', external: false },
      { name: 'Feature 3', href: '#', external: false },
      { name: 'Feature 4', href: '#', external: false },
      { name: 'Feature 5', href: '#', external: false }
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Contact', href: Routes.Contact, external: false },
      { name: 'Roadmap', href: Routes.Roadmap, external: true },
      { name: 'Docs', href: Routes.Docs, external: false }
    ]
  },
  {
    title: 'About',
    links: [
      { name: 'Story', href: Routes.Story, external: false },
      { name: 'Blog', href: Routes.Blog, external: false },
      { name: 'Careers', href: Routes.Careers, external: false }
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Use', href: Routes.TermsOfService, external: false },
      { name: 'Privacy Policy', href: Routes.PrivacyPolicy, external: false },
      { name: 'Cookie Policy', href: Routes.CookiePolicy, external: false }
    ]
  }
];

export const SOCIAL_LINKS = [
  {
    name: 'X (formerly Twitter)',
    href: '#',
    icon: <XTwitterIcon className="size-4 shrink-0" />
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: <LinkedInIcon className="size-4 shrink-0" />
  },
  {
    name: 'Facebook',
    href: '#',
    icon: <FacebookIcon className="size-4 shrink-0" />
  },
  {
    name: 'Instagram',
    href: '#',
    icon: <InstagramIcon className="size-4 shrink-0" />
  },
  {
    name: 'TikTok',
    href: '#',
    icon: <TikTokIcon className="size-4 shrink-0" />
  }
];

export const DOCS_LINKS = [
  {
    title: 'Getting Started',
    icon: <CuboidIcon className="size-4 shrink-0 text-muted-foreground" />,
    items: [
      {
        title: 'Introduction',
        href: '/docs',
        items: []
      },
      {
        title: 'Dependencies',
        href: '/docs/dependencies',
        items: []
      }
    ]
  },
  {
    title: 'Guides',
    icon: <BookIcon className="size-4 shrink-0 text-muted-foreground" />,
    items: [
      {
        title: 'Using MDX',
        href: '/docs/using-mdx',
        items: []
      }
    ]
  }
];
