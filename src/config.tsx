import { BlueskyIcon } from '@/components/icons/bluesky';
import { FacebookIcon } from '@/components/icons/facebook';
import { GitHubIcon } from '@/components/icons/github';
import { InstagramIcon } from '@/components/icons/instagram';
import { LinkedInIcon } from '@/components/icons/linkedin';
import { TikTokIcon } from '@/components/icons/tiktok';
import { TwitterIcon } from '@/components/icons/twitter';
import { YouTubeIcon } from '@/components/icons/youtube';
import { Routes } from '@/routes';
import { MenuItem, NestedMenuItem, WebsiteConfig } from '@/types';
import {
  AudioLinesIcon,
  BellIcon,
  BotIcon,
  BuildingIcon,
  ChartNoAxesCombinedIcon,
  CircleDollarSignIcon,
  CircleHelpIcon,
  CircleUserRoundIcon,
  CookieIcon,
  CreditCardIcon,
  FileTextIcon,
  FilmIcon,
  FlameIcon,
  ImageIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  LockKeyholeIcon,
  MailboxIcon,
  MailIcon,
  NewspaperIcon,
  RocketIcon,
  Settings2Icon,
  ShieldCheckIcon,
  SquareKanbanIcon,
  SquarePenIcon,
  ThumbsUpIcon,
  WandSparklesIcon,
  SquareCodeIcon,
  UsersIcon,
  FootprintsIcon,
  SplitSquareVerticalIcon,
  LogInIcon,
  UserPlusIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { XTwitterIcon } from './components/icons/x';

/**
 * website config, without translations
 */
export const websiteConfig: WebsiteConfig = {
  theme: "default",
  metadata: {
    image: '/og.png',
  },
  mail: {
    from: 'support@mksaas.com',
    to: 'support@mksaas.com',
  },
  social: {
    github: 'https://github.com/MkSaaSHQ',
    twitter: 'https://x.com/MkSaaSHQ',
    blueSky: 'https://bsky.app/profile/mksaas.com',
    youtube: 'https://www.youtube.com/@MkSaaSHQ',
    linkedin: 'https://linkedin.com/company/mksaas',
    facebook: 'https://facebook.com/mksaas',
    instagram: 'https://instagram.com/mksaas',
    tiktok: 'https://tiktok.com/@mksaas',
  }
};

/**
 * Get menu links with translations
 * 
 * NOTICE: used in client components only
 *
 * @param t - The translation function
 * @returns The menu links with translated titles and descriptions
 */
export function getMenuLinks(): NestedMenuItem[] {
  const t = useTranslations();

  return [
    {
      title: t('Marketing.navbar.features.title'),
      href: Routes.Features,
      external: false,
    },
    {
      title: t('Marketing.navbar.pricing.title'),
      href: Routes.Pricing,
      external: false,
    },
    {
      title: t('Marketing.navbar.blog.title'),
      href: Routes.Blog,
      external: false,
    },
    {
      title: t('Marketing.navbar.docs.title'),
      href: Routes.Docs,
      external: false,
    },
    {
      title: t('Marketing.navbar.ai.title'),
      items: [
        {
          title: t('Marketing.navbar.ai.items.text.title'),
          description: t('Marketing.navbar.ai.items.text.description'),
          icon: <SquarePenIcon className="site-4 shrink-0" />,
          href: Routes.AIText,
          external: false,
        },
        {
          title: t('Marketing.navbar.ai.items.image.title'),
          description: t('Marketing.navbar.ai.items.image.description'),
          icon: <ImageIcon className="site-4 shrink-0" />,
          href: Routes.AIImage,
          external: false,
        },
        {
          title: t('Marketing.navbar.ai.items.video.title'),
          description: t('Marketing.navbar.ai.items.video.description'),
          icon: <FilmIcon className="site-4 shrink-0" />,
          href: Routes.AIVideo,
          external: false,
        },
        {
          title: t('Marketing.navbar.ai.items.audio.title'),
          description: t('Marketing.navbar.ai.items.audio.description'),
          icon: <AudioLinesIcon className="site-4 shrink-0" />,
          href: Routes.AIAudio,
          external: false,
        },
      ],
    },
    {
      title: t('Marketing.navbar.pages.title'),
      items: [
        {
          title: t('Marketing.navbar.pages.items.about.title'),
          description: t('Marketing.navbar.pages.items.about.description'),
          icon: <BuildingIcon className="site-4 shrink-0" />,
          href: Routes.About,
          external: false,
        },
        {
          title: t('Marketing.navbar.pages.items.contact.title'),
          description: t('Marketing.navbar.pages.items.contact.description'),
          icon: <MailIcon className="site-4 shrink-0" />,
          href: Routes.Contact,
          external: false,
        },
        {
          title: t('Marketing.navbar.pages.items.waitlist.title'),
          description: t('Marketing.navbar.pages.items.waitlist.description'),
          icon: <MailboxIcon className="site-4 shrink-0" />,
          href: Routes.Waitlist,
          external: false,
        },
        {
          title: t('Marketing.navbar.pages.items.roadmap.title'),
          description: t('Marketing.navbar.pages.items.roadmap.description'),
          icon: <SquareKanbanIcon className="site-4 shrink-0" />,
          href: Routes.Roadmap,
          external: true,
        },
        {
          title: t('Marketing.navbar.pages.items.changelog.title'),
          description: t('Marketing.navbar.pages.items.changelog.description'),
          icon: <ListChecksIcon className="site-4 shrink-0" />,
          href: Routes.Changelog,
          external: false,
        },
        {
          title: t('Marketing.navbar.pages.items.cookiePolicy.title'),
          description: t(
            'Marketing.navbar.pages.items.cookiePolicy.description'
          ),
          icon: <CookieIcon className="site-4 shrink-0" />,
          href: Routes.CookiePolicy,
          external: false,
        },
        {
          title: t('Marketing.navbar.pages.items.privacyPolicy.title'),
          description: t(
            'Marketing.navbar.pages.items.privacyPolicy.description'
          ),
          icon: <ShieldCheckIcon className="site-4 shrink-0" />,
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: t('Marketing.navbar.pages.items.termsOfService.title'),
          description: t(
            'Marketing.navbar.pages.items.termsOfService.description'
          ),
          icon: <FileTextIcon className="site-4 shrink-0" />,
          href: Routes.TermsOfService,
          external: false,
        },
      ],
    },
    {
      title: t('Marketing.navbar.blocks.title'),
      items: [
        {
          title: t('Marketing.navbar.blocks.items.hero.title'),
          icon: <FlameIcon className="site-4 shrink-0" />,
          href: Routes.HeroBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.logo.title'),
          icon: <SquareCodeIcon className="site-4 shrink-0" />,
          href: Routes.LogoBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.features.title'),
          icon: <WandSparklesIcon className="site-4 shrink-0" />,
          href: Routes.FeaturesBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.content.title'),
          icon: <NewspaperIcon className="site-4 shrink-0" />,
          href: Routes.ContentBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.stats.title'),
          icon: <ChartNoAxesCombinedIcon className="site-4 shrink-0" />,
          href: Routes.StatsBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.team.title'),
          icon: <UsersIcon className="site-4 shrink-0" />,
          href: Routes.TeamBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.testimonials.title'),
          icon: <ThumbsUpIcon className="site-4 shrink-0" />,
          href: Routes.TestimonialsBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.callToAction.title'),
          icon: <RocketIcon className="site-4 shrink-0" />,
          href: Routes.CallToActionBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.footer.title'),
          icon: <FootprintsIcon className="site-4 shrink-0" />,
          href: Routes.FooterBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.pricing.title'),
          icon: <CircleDollarSignIcon className="site-4 shrink-0" />,
          href: Routes.PricingBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.comparator.title'),
          icon: <SplitSquareVerticalIcon className="site-4 shrink-0" />,
          href: Routes.ComparatorBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.faq.title'),
          icon: <CircleHelpIcon className="site-4 shrink-0" />,
          href: Routes.FAQBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.login.title'),
          icon: <LogInIcon className="site-4 shrink-0" />,
          href: Routes.LoginBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.signup.title'),
          icon: <UserPlusIcon className="site-4 shrink-0" />,
          href: Routes.SignupBlocks,
          external: false,
        },
        {
          title: t('Marketing.navbar.blocks.items.contact.title'),
          icon: <MailIcon className="site-4 shrink-0" />,
          href: Routes.ContactBlocks,
          external: false,
        },
      ],
    },
  ];
}

/**
 * Get footer links with translations
 * 
 * NOTICE: used in client components only
 *
 * @param t - The translation function
 * @returns The footer links with translated titles
 */
export function getFooterLinks(): NestedMenuItem[] {
  const t = useTranslations();

  return [
    {
      title: t('Marketing.footer.product.title'),
      items: [
        {
          title: t('Marketing.footer.product.items.features'),
          href: Routes.Features,
          external: false,
        },
        {
          title: t('Marketing.footer.product.items.pricing'),
          href: Routes.Pricing,
          external: false,
        },
        {
          title: t('Marketing.footer.product.items.faq'),
          href: Routes.FAQ,
          external: false,
        },
      ],
    },
    {
      title: t('Marketing.footer.resources.title'),
      items: [
        {
          title: t('Marketing.footer.resources.items.blog'),
          href: Routes.Blog,
          external: false,
        },
        {
          title: t('Marketing.footer.resources.items.changelog'),
          href: Routes.Changelog,
          external: false,
        },
        {
          title: t('Marketing.footer.resources.items.roadmap'),
          href: Routes.Roadmap,
          external: true,
        },
      ],
    },
    {
      title: t('Marketing.footer.company.title'),
      items: [
        {
          title: t('Marketing.footer.company.items.about'),
          href: Routes.About,
          external: false,
        },
        {
          title: t('Marketing.footer.company.items.contact'),
          href: Routes.Contact,
          external: false,
        },
        {
          title: t('Marketing.footer.company.items.waitlist'),
          href: Routes.Waitlist,
          external: false,
        },
      ],
    },
    {
      title: t('Marketing.footer.legal.title'),
      items: [
        {
          title: t('Marketing.footer.legal.items.cookiePolicy'),
          href: Routes.CookiePolicy,
          external: false,
        },
        {
          title: t('Marketing.footer.legal.items.privacyPolicy'),
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: t('Marketing.footer.legal.items.termsOfService'),
          href: Routes.TermsOfService,
          external: false,
        },
      ],
    },
  ];
}

/**
 * Get avatar links with translations
 * 
 * NOTICE: used in client components only
 *
 * @param t - The translation function
 * @returns The avatar links with translated titles
 */
export function getAvatarLinks(): MenuItem[] {
  const t = useTranslations();

  return [
    {
      title: t('Marketing.avatar.dashboard'),
      href: Routes.Dashboard,
      icon: <LayoutDashboardIcon className="size-4 shrink-0" />,
    },
    {
      title: t('Marketing.avatar.settings'),
      href: Routes.SettingsProfile,
      icon: <Settings2Icon className="size-4 shrink-0" />,
    },
  ];
}

/**
 * Get sidebar navigation main links with translations
 *
 * NOTICE: used in client components only
 *
 * @param t - The translation function
 * @returns The menu links with translated titles and descriptions
 */
export function getNavMainLinks(): NestedMenuItem[] {
  const t = useTranslations();

  return [
    {
      title: t('Dashboard.sidebar.dashboard.title'),
      icon: <LayoutDashboardIcon className="site-4 shrink-0" />,
      href: Routes.Dashboard,
      external: false,
    },
    {
      title: t('Dashboard.sidebar.ai.title'),
      icon: <BotIcon className="site-4 shrink-0" />,
      items: [
        {
          title: t('Dashboard.sidebar.ai.items.text.title'),
          icon: <SquarePenIcon className="site-4 shrink-0" />,
          href: Routes.AIText,
          external: false,
        },
        {
          title: t('Dashboard.sidebar.ai.items.image.title'),
          icon: <ImageIcon className="site-4 shrink-0" />,
          href: Routes.AIImage,
          external: false,
        },
        {
          title: t('Dashboard.sidebar.ai.items.video.title'),
          icon: <FilmIcon className="site-4 shrink-0" />,
          href: Routes.AIVideo,
          external: false,
        },
        {
          title: t('Dashboard.sidebar.ai.items.audio.title'),
          icon: <AudioLinesIcon className="site-4 shrink-0" />,
          href: Routes.AIAudio,
          external: false,
        },
      ],
    },
    {
      title: t('Dashboard.sidebar.settings.title'),
      icon: <Settings2Icon className="site-4 shrink-0" />,
      items: [
        {
          title: t('Dashboard.sidebar.settings.items.profile.title'),
          icon: <CircleUserRoundIcon className="site-4 shrink-0" />,
          href: Routes.SettingsProfile,
          external: false,
        },
        {
          title: t('Dashboard.sidebar.settings.items.billing.title'),
          icon: <CreditCardIcon className="site-4 shrink-0" />,
          href: Routes.SettingsBilling,
          external: false,
        },
        {
          title: t('Dashboard.sidebar.settings.items.security.title'),
          icon: <LockKeyholeIcon className="site-4 shrink-0" />,
          href: Routes.SettingsSecurity,
          external: false,
        },
        {
          title: t('Dashboard.sidebar.settings.items.notification.title'),
          icon: <BellIcon className="site-4 shrink-0" />,
          href: Routes.SettingsNotifications,
          external: false,
        }
      ],
    },
  ];
}

/**
 * list all the social links here, you can delete the ones that are not needed
 */
export function getSocialLinks(): MenuItem[] {
  const socialLinks: MenuItem[] = [];

  // Only add social links that are configured in websiteConfig
  if (websiteConfig.mail.from) {
    socialLinks.push({
      title: 'Email',
      href: `mailto:${websiteConfig.mail.from}`,
      icon: <MailIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.social.github) {
    socialLinks.push({
      title: 'GitHub',
      href: websiteConfig.social.github,
      icon: <GitHubIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.social.twitter) {
    socialLinks.push({
      title: 'Twitter',
      href: websiteConfig.social.twitter,
      icon: <XTwitterIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.social.blueSky) {
    socialLinks.push({
      title: 'Bluesky',
      href: websiteConfig.social.blueSky,
      icon: <BlueskyIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.social.youtube) {
    socialLinks.push({
      title: 'YouTube',
      href: websiteConfig.social.youtube,
      icon: <YouTubeIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.social.linkedin) {
    socialLinks.push({
      title: 'LinkedIn',
      href: websiteConfig.social.linkedin,
      icon: <LinkedInIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.social.facebook) {
    socialLinks.push({
      title: 'Facebook',
      href: websiteConfig.social.facebook,
      icon: <FacebookIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.social.instagram) {
    socialLinks.push({
      title: 'Instagram',
      href: websiteConfig.social.instagram,
      icon: <InstagramIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.social.tiktok) {
    socialLinks.push({
      title: 'TikTok',
      href: websiteConfig.social.tiktok,
      icon: <TikTokIcon className="size-4 shrink-0" />,
    });
  }

  return socialLinks;
}
