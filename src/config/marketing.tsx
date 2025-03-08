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
  BuildingIcon,
  ChartNoAxesCombinedIcon,
  CircleDollarSignIcon,
  CircleHelpIcon,
  CookieIcon,
  FileTextIcon,
  FilmIcon,
  FlameIcon,
  ImageIcon,
  ListChecksIcon,
  MailboxIcon,
  MailIcon,
  NewspaperIcon,
  RocketIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SquareKanbanIcon,
  SquarePenIcon,
  WandSparklesIcon
} from 'lucide-react';

type TranslationFunction = (key: string, ...args: any[]) => string;

/**
 * Creates a translation function that works with our menu functions
 * @param t - The next-intl translation function
 * @returns A translation function that accepts string keys
 */
export function createTranslator(t: any): TranslationFunction {
  return (key: string) => {
    try {
      // @ts-ignore - We know this is a valid key because we've defined it in our messages
      return t(key);
    } catch (error) {
      console.error(`Translation key not found: ${key}`);
      return key.split('.').pop() || key;
    }
  };
}

/**
 * Get menu links with translations
 * 
 * @param t - The translation function
 * @returns The menu links with translated titles and descriptions
 */
export function getMenuLinks(t: TranslationFunction): NestedMenuItem[] {
  return [
    {
      title: t('Marketing.navbar.features.title'),
      href: Routes.Features,
      external: false
    },
    {
      title: t('Marketing.navbar.pricing.title'),
      href: Routes.Pricing,
      external: false
    },
    {
      title: t('Marketing.navbar.blog.title'),
      href: Routes.Blog,
      external: false
    },
    {
      title: t('Marketing.navbar.ai.title'),
      items: [
        {
          title: t('Marketing.navbar.ai.items.text.title'),
          description: t('Marketing.navbar.ai.items.text.description'),
          icon: <SquarePenIcon className="size-5 shrink-0" />,
          href: Routes.AIText,
          external: false
        },
        {
          title: t('Marketing.navbar.ai.items.image.title'),
          description: t('Marketing.navbar.ai.items.image.description'),
          icon: <ImageIcon className="size-5 shrink-0" />,
          href: Routes.AIImage,
          external: false
        },
        {
          title: t('Marketing.navbar.ai.items.video.title'),
          description: t('Marketing.navbar.ai.items.video.description'),
          icon: <FilmIcon className="size-5 shrink-0" />,
          href: Routes.AIVideo,
          external: false
        },
        {
          title: t('Marketing.navbar.ai.items.audio.title'),
          description: t('Marketing.navbar.ai.items.audio.description'),
          icon: <AudioLinesIcon className="size-5 shrink-0" />,
          href: Routes.AIAudio,
          external: false
        }
      ]
    },
    {
      title: t('Marketing.navbar.pages.title'),
      items: [
        {
          title: t('Marketing.navbar.pages.items.about.title'),
          description: t('Marketing.navbar.pages.items.about.description'),
          icon: <BuildingIcon className="size-5 shrink-0" />,
          href: Routes.About,
          external: false
        },
        {
          title: t('Marketing.navbar.pages.items.contact.title'),
          description: t('Marketing.navbar.pages.items.contact.description'),
          icon: <MailIcon className="size-5 shrink-0" />,
          href: Routes.Contact,
          external: false
        },
        {
          title: t('Marketing.navbar.pages.items.waitlist.title'),
          description: t('Marketing.navbar.pages.items.waitlist.description'),
          icon: <MailboxIcon className="size-5 shrink-0" />,
          href: Routes.Waitlist,
          external: false
        },
        {
          title: t('Marketing.navbar.pages.items.changelog.title'),
          description: t('Marketing.navbar.pages.items.changelog.description'),
          icon: <ListChecksIcon className="size-5 shrink-0" />,
          href: Routes.Changelog,
          external: false
        },
        {
          title: t('Marketing.navbar.pages.items.roadmap.title'),
          description: t('Marketing.navbar.pages.items.roadmap.description'),
          icon: <SquareKanbanIcon className="size-5 shrink-0" />,
          href: Routes.Roadmap,
          external: true
        },
        {
          title: t('Marketing.navbar.pages.items.cookiePolicy.title'),
          description: t('Marketing.navbar.pages.items.cookiePolicy.description'),
          icon: <CookieIcon className="size-5 shrink-0" />,
          href: Routes.CookiePolicy,
          external: false
        },
        {
          title: t('Marketing.navbar.pages.items.privacyPolicy.title'),
          description: t('Marketing.navbar.pages.items.privacyPolicy.description'),
          icon: <ShieldCheckIcon className="size-5 shrink-0" />,
          href: Routes.PrivacyPolicy,
          external: false
        },
        {
          title: t('Marketing.navbar.pages.items.termsOfService.title'),
          description: t('Marketing.navbar.pages.items.termsOfService.description'),
          icon: <FileTextIcon className="size-5 shrink-0" />,
          href: Routes.TermsOfService,
          external: false
        }
      ]
    },
    {
      title: t('Marketing.navbar.blocks.title'),
      items: [
        {
          title: t('Marketing.navbar.blocks.items.hero.title'),
          icon: <FlameIcon className="size-5 shrink-0" />,
          href: Routes.HeroBlocks,
          external: false
        },
        {
          title: t('Marketing.navbar.blocks.items.pricing.title'),
          icon: <CircleDollarSignIcon className="size-5 shrink-0" />,
          href: Routes.PricingBlocks,
          external: false
        },
        {
          title: t('Marketing.navbar.blocks.items.features.title'),
          icon: <WandSparklesIcon className="size-5 shrink-0" />,
          href: Routes.FeaturesBlocks,
          external: false
        },
        {
          title: t('Marketing.navbar.blocks.items.faq.title'),
          icon: <CircleHelpIcon className="size-5 shrink-0" />,
          href: Routes.FAQBlocks,
          external: false
        },
        {
          title: t('Marketing.navbar.blocks.items.stats.title'),
          icon: <ChartNoAxesCombinedIcon className="size-5 shrink-0" />,
          href: Routes.StatsBlocks,
          external: false
        },
        {
          title: t('Marketing.navbar.blocks.items.callToAction.title'),
          icon: <RocketIcon className="size-5 shrink-0" />,
          href: Routes.CallToActionBlocks,
          external: false
        },
        {
          title: t('Marketing.navbar.blocks.items.content.title'),
          icon: <NewspaperIcon className="size-5 shrink-0" />,
          href: Routes.ContentBlocks,
          external: false
        }
      ]
    }
  ];
}

/**
 * Get footer links with translations
 * @param t - The translation function
 * @returns The footer links with translated titles
 */
export function getFooterLinks(t: TranslationFunction): NestedMenuItem[] {
  return [
    {
      title: t('Marketing.footer.product.title'),
      items: [
        { title: t('Marketing.footer.product.items.features'), href: Routes.Features, external: false },
        { title: t('Marketing.footer.product.items.pricing'), href: Routes.Pricing, external: false },
        { title: t('Marketing.footer.product.items.faq'), href: Routes.FAQ, external: false },
      ]
    },
    {
      title: t('Marketing.footer.resources.title'),
      items: [
        { title: t('Marketing.footer.resources.items.blog'), href: Routes.Blog, external: false },
        { title: t('Marketing.footer.resources.items.changelog'), href: Routes.Changelog, external: false },
        { title: t('Marketing.footer.resources.items.roadmap'), href: Routes.Roadmap, external: true },
      ]
    },
    {
      title: t('Marketing.footer.company.title'),
      items: [
        { title: t('Marketing.footer.company.items.about'), href: Routes.About, external: false },
        { title: t('Marketing.footer.company.items.contact'), href: Routes.Contact, external: false },
        { title: t('Marketing.footer.company.items.waitlist'), href: Routes.Waitlist, external: false }
      ]
    },
    {
      title: t('Marketing.footer.legal.title'),
      items: [
        { title: t('Marketing.footer.legal.items.cookiePolicy'), href: Routes.CookiePolicy, external: false },
        { title: t('Marketing.footer.legal.items.privacyPolicy'), href: Routes.PrivacyPolicy, external: false },
        { title: t('Marketing.footer.legal.items.termsOfService'), href: Routes.TermsOfService, external: false },
      ]
    }
  ];
}

/**
 * list all the social links here, you can delete the ones that are not needed
 */
export function getSocialLinks(): MenuItem[] {
  return [
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
}

/**
 * Get avatar links with translations
 * @param t - The translation function
 * @returns The avatar links with translated titles
 */
export function getAvatarLinks(t: TranslationFunction): MenuItem[] {
  return [
    {
      title: t('Marketing.avatar.dashboard'),
      href: Routes.Dashboard,
      icon: <DashboardIcon className="size-4 shrink-0" />
    },
    {
      title: t('Marketing.avatar.settings'),
      href: Routes.Settings,
      icon: <SettingsIcon className="size-4 shrink-0" />
    }
  ];
}