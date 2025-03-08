import { BlueskyIcon } from '@/components/icons/bluesky';
import { FacebookIcon } from '@/components/icons/facebook';
import { GitHubIcon } from '@/components/icons/github';
import { InstagramIcon } from '@/components/icons/instagram';
import { LinkedInIcon } from '@/components/icons/linkedin';
import { TikTokIcon } from '@/components/icons/tiktok';
import { TwitterIcon } from '@/components/icons/twitter';
import { YouTubeIcon } from '@/components/icons/youtube';
import { Routes } from '@/routes';
import { MenuItem, NestedMenuItem } from '@/types';
import { DashboardIcon } from '@radix-ui/react-icons';
import {
  AudioLinesIcon,
  CookieIcon,
  FileTextIcon,
  FilmIcon,
  ImageIcon,
  InfoIcon,
  ListChecksIcon,
  MailboxIcon,
  MailIcon,
  SettingsIcon,
  ShieldIcon,
  SquareKanbanIcon,
  SquarePenIcon
} from 'lucide-react';

/**
 * list all the menu links here, you can customize the links as you want
 */
export const MENU_LINKS: NestedMenuItem[] = [
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
  {
    title: 'AI',
    items: [
      {
        title: 'AI Tex',
        description: 'show how to use AI to write stunning text',
        icon: <SquarePenIcon className="size-5 shrink-0" />,
        href: Routes.AIText,
        external: false
      },
      {
        title: 'AI Image',
        description: 'show how to use AI to generate beautiful images',
        icon: <ImageIcon className="size-5 shrink-0" />,
        href: Routes.AIImage,
        external: false
      },
      {
        title: 'AI Video',
        description: 'show how to use AI to generate amazing videos',
        icon: <FilmIcon className="size-5 shrink-0" />,
        href: Routes.AIVideo,
        external: false
      },
      {
        title: 'AI Audio',
        description: 'show how to use AI to generate wonderful audio',
        icon: <AudioLinesIcon className="size-5 shrink-0" />,
        href: Routes.AIAudio,
        external: false
      }
    ]
  },
  {
    title: 'Pages',
    items: [
      {
        title: 'About',
        description: 'Learn more about our company, mission, and values',
        icon: <InfoIcon className="size-5 shrink-0" />,
        href: Routes.About,
        external: false
      },
      {
        title: 'Contact',
        description: 'Get in touch with our team for support or inquiries',
        icon: <MailIcon className="size-5 shrink-0" />,
        href: Routes.Contact,
        external: false
      },
      {
        title: 'Waitlist',
        description: 'Join our waitlist for latest news and updates',
        icon: <MailboxIcon className="size-5 shrink-0" />,
        href: Routes.Waitlist,
        external: false
      },
      {
        title: 'Changelog',
        description: 'See the latest updates to our products',
        icon: <ListChecksIcon className="size-5 shrink-0" />,
        href: Routes.Changelog,
        external: false
      },
      {
        title: 'Roadmap',
        description: 'Explore our future plans and upcoming features',
        icon: <SquareKanbanIcon className="size-5 shrink-0" />,
        href: Routes.Roadmap,
        external: true
      },
      {
        title: 'Cookie Policy',
        description: 'Information about how we use cookies on our website',
        icon: <CookieIcon className="size-5 shrink-0" />,
        href: Routes.CookiePolicy,
        external: false
      },
      {
        title: 'Privacy Policy',
        description: 'Details about how we protect and handle your data',
        icon: <ShieldIcon className="size-5 shrink-0" />,
        href: Routes.PrivacyPolicy,
        external: false
      },
      {
        title: 'Terms of Service',
        description: 'The legal agreement between you and our company',
        icon: <FileTextIcon className="size-5 shrink-0" />,
        href: Routes.TermsOfService,
        external: false
      }
    ]
  },
];

/**
 * list all the footer links here, you can customize the links as you want
 */
export const FOOTER_LINKS: NestedMenuItem[] = [
  {
    title: 'Product',
    items: [
      { title: 'Features', href: Routes.Features, external: false },
      { title: 'Pricing', href: Routes.Pricing, external: false },
      { title: 'FAQ', href: Routes.FAQ, external: false },
    ]
  },
  {
    title: 'Resources',
    items: [
      { title: 'Blog', href: Routes.Blog, external: false },
      { title: 'Changelog', href: Routes.Changelog, external: false },
      { title: 'Roadmap', href: Routes.Roadmap, external: true },
    ]
  },
  {
    title: 'Company',
    items: [
      { title: 'About', href: Routes.About, external: false },
      { title: 'Contact', href: Routes.Contact, external: false },
      { title: 'Waitlist', href: Routes.Waitlist, external: false }
    ]
  },
  {
    title: 'Legal',
    items: [
      { title: 'Cookie Policy', href: Routes.CookiePolicy, external: false },
      { title: 'Privacy Policy', href: Routes.PrivacyPolicy, external: false },
      { title: 'Terms of Service', href: Routes.TermsOfService, external: false },
    ]
  }
];

/**
 * list all the social links here, you can delete the ones that are not needed
 */
export const SOCIAL_LINKS: MenuItem[] = [
  {
    title: 'Email',
    href: 'mailto:mksaas@gmail.com',
    icon: <MailIcon className="size-4 shrink-0" />
  },
  {
    title: 'GitHub',
    href: 'https://github.com/MkSaaSHQ',
    icon: <GitHubIcon className="size-4 shrink-0" />
  },
  {
    title: 'Twitter',
    href: 'https://twitter.com/mksaas',
    icon: <TwitterIcon className="size-4 shrink-0" />
  },
  {
    title: 'Bluesky',
    href: 'https://bsky.app/profile/mksaas.com',
    icon: <BlueskyIcon className="size-4 shrink-0" />
  },
  {
    title: 'YouTube',
    href: 'https://www.youtube.com/@MkSaaSHQ',
    icon: <YouTubeIcon className="size-4 shrink-0" />
  },
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/company/mksaas',
    icon: <LinkedInIcon className="size-4 shrink-0" />
  },
  {
    title: 'Facebook',
    href: 'https://www.facebook.com/mksaas',
    icon: <FacebookIcon className="size-4 shrink-0" />
  },
  {
    title: 'Instagram',
    href: 'https://www.instagram.com/mksaas',
    icon: <InstagramIcon className="size-4 shrink-0" />
  },
  {
    title: 'TikTok',
    href: 'https://www.tiktok.com/@mksaas',
    icon: <TikTokIcon className="size-4 shrink-0" />
  }
];

/**
 * list all the avatar links here, you can customize the links as you want
 */
export const AVATAR_LINKS: MenuItem[] = [
  {
    title: 'Dashboard',
    href: Routes.Dashboard,
    icon: <DashboardIcon className="size-4 shrink-0" />
  },
  {
    title: 'Settings',
    href: Routes.Settings,
    icon: <SettingsIcon className="size-4 shrink-0" />
  }
];