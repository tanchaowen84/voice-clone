'use client';

import { Routes } from '@/routes';
import type { NestedMenuItem } from '@/types';
import {
  AudioLinesIcon,
  CookieIcon,
  FileTextIcon,
  MicIcon,
  RadioIcon,
  ShieldCheckIcon,
  VolumeXIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Get navbar config with translations
 *
 * NOTICE: used in client components only
 *
 * docs:
 * https://mksaas.com/docs/config/navbar
 *
 * @returns The navbar config with translated titles and descriptions
 */
export function getNavbarLinks(): NestedMenuItem[] {
  const t = useTranslations('Marketing.navbar');

  const links: NestedMenuItem[] = [
    {
      title: t('features.title'),
      href: Routes.Features,
      external: false,
    },
    {
      title: t('pricing.title'),
      href: Routes.Pricing,
      external: false,
    },
    {
      title: t('tools.title'),
      items: [
        {
          title: t('tools.items.audioEnhancer.title'),
          description: t('tools.items.audioEnhancer.description'),
          icon: <AudioLinesIcon className="size-4 shrink-0" />,
          href: Routes.ToolsAudioEnhancer,
          external: false,
        },
        {
          title: t('tools.items.echoRemover.title'),
          description: t('tools.items.echoRemover.description'),
          icon: <VolumeXIcon className="size-4 shrink-0" />,
          href: Routes.ToolsEchoRemover,
          external: false,
        },
        {
          title: t('tools.items.voiceRecorder.title'),
          description: t('tools.items.voiceRecorder.description'),
          icon: <RadioIcon className="size-4 shrink-0" />,
          href: Routes.ToolsVoiceRecorder,
          external: false,
        },
        {
          title: t('tools.items.micTest.title'),
          description: t('tools.items.micTest.description'),
          icon: <MicIcon className="size-4 shrink-0" />,
          href: Routes.ToolsMicTest,
          external: false,
        },
      ],
    },
    {
      title: t('blog.title'),
      href: Routes.Blog,
      external: false,
    },
  ];

  links.push(
    // {
    //   title: t('ai.title'),
    //   items: [
    //     {
    //       title: t('ai.items.text.title'),
    //       description: t('ai.items.text.description'),
    //       icon: <SquarePenIcon className="size-4 shrink-0" />,
    //       href: Routes.AIText,
    //       external: false,
    //     },
    //     {
    //       title: t('ai.items.image.title'),
    //       description: t('ai.items.image.description'),
    //       icon: <ImageIcon className="size-4 shrink-0" />,
    //       href: Routes.AIImage,
    //       external: false,
    //     },
    //     {
    //       title: t('ai.items.video.title'),
    //       description: t('ai.items.video.description'),
    //       icon: <FilmIcon className="size-4 shrink-0" />,
    //       href: Routes.AIVideo,
    //       external: false,
    //     },
    //     {
    //       title: t('ai.items.audio.title'),
    //       description: t('ai.items.audio.description'),
    //       icon: <AudioLinesIcon className="size-4 shrink-0" />,
    //       href: Routes.AIAudio,
    //       external: false,
    //     },
    //   ],
    // },
    {
      title: t('pages.title'),
      items: [
        {
          title: t('pages.items.cookiePolicy.title'),
          description: t('pages.items.cookiePolicy.description'),
          icon: <CookieIcon className="size-4 shrink-0" />,
          href: Routes.CookiePolicy,
          external: false,
        },
        {
          title: t('pages.items.privacyPolicy.title'),
          description: t('pages.items.privacyPolicy.description'),
          icon: <ShieldCheckIcon className="size-4 shrink-0" />,
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: t('pages.items.termsOfService.title'),
          description: t('pages.items.termsOfService.description'),
          icon: <FileTextIcon className="size-4 shrink-0" />,
          href: Routes.TermsOfService,
          external: false,
        },
      ],
    }
  );

  return links;
}
