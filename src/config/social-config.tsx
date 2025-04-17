'use client';

import { BlueskyIcon } from '@/components/icons/bluesky';
import { FacebookIcon } from '@/components/icons/facebook';
import { GitHubIcon } from '@/components/icons/github';
import { InstagramIcon } from '@/components/icons/instagram';
import { LinkedInIcon } from '@/components/icons/linkedin';
import { TikTokIcon } from '@/components/icons/tiktok';
import { XTwitterIcon } from '@/components/icons/x';
import { YouTubeIcon } from '@/components/icons/youtube';
import { MenuItem } from '@/types';
import { websiteConfig } from './website';
import { DiscordIcon } from '@/components/icons/discord';

/**
 * Get social config
 * 
 * NOTICE: used in client components only
 *
 * @returns The social config
 */
export function getSocialLinks(): MenuItem[] {
  const socialLinks: MenuItem[] = [];

  if (websiteConfig.metadata.social?.github) {
    socialLinks.push({
      title: 'GitHub',
      href: websiteConfig.metadata.social.github,
      icon: <GitHubIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.metadata.social?.twitter) {
    socialLinks.push({
      title: 'Twitter',
      href: websiteConfig.metadata.social.twitter,
      icon: <XTwitterIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.metadata.social?.blueSky) {
    socialLinks.push({
      title: 'Bluesky',
      href: websiteConfig.metadata.social.blueSky,
      icon: <BlueskyIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.metadata.social?.discord) {
    socialLinks.push({
      title: 'Discord',
      href: websiteConfig.metadata.social.discord,
      icon: <DiscordIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.metadata.social?.youtube) {
    socialLinks.push({
      title: 'YouTube',
      href: websiteConfig.metadata.social.youtube,
      icon: <YouTubeIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.metadata.social?.linkedin) {
    socialLinks.push({
      title: 'LinkedIn',
      href: websiteConfig.metadata.social.linkedin,
      icon: <LinkedInIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.metadata.social?.facebook) {
    socialLinks.push({
      title: 'Facebook',
      href: websiteConfig.metadata.social.facebook,
      icon: <FacebookIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.metadata.social?.instagram) {
    socialLinks.push({
      title: 'Instagram',
      href: websiteConfig.metadata.social.instagram,
      icon: <InstagramIcon className="size-4 shrink-0" />,
    });
  }

  if (websiteConfig.metadata.social?.tiktok) {
    socialLinks.push({
      title: 'TikTok',
      href: websiteConfig.metadata.social.tiktok,
      icon: <TikTokIcon className="size-4 shrink-0" />,
    });
  }

  return socialLinks;
}
