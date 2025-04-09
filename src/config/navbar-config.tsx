'use client';

import { Routes } from '@/routes';
import { NestedMenuItem } from '@/types';
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
  FootprintsIcon,
  ImageIcon,
  ListChecksIcon,
  LogInIcon,
  MailIcon,
  MailboxIcon,
  NewspaperIcon,
  RocketIcon,
  ShieldCheckIcon,
  SplitSquareVerticalIcon,
  SquareCodeIcon,
  SquareKanbanIcon,
  SquarePenIcon,
  ThumbsUpIcon,
  UserPlusIcon,
  UsersIcon,
  WandSparklesIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Get navbar config with translations
 * 
 * NOTICE: used in client components only
 *
 * @returns The navbar config with translated titles and descriptions
 */
export function getNavbarConfig(): NestedMenuItem[] {
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
