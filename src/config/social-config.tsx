'use client';

import { BlueskyIcon } from '@/components/icons/bluesky';
import { FacebookIcon } from '@/components/icons/facebook';
import { GitHubIcon } from '@/components/icons/github';
import { InstagramIcon } from '@/components/icons/instagram';
import { LinkedInIcon } from '@/components/icons/linkedin';
import { TikTokIcon } from '@/components/icons/tiktok';
import { YouTubeIcon } from '@/components/icons/youtube';
import { XTwitterIcon } from '@/components/icons/x';
import { MenuItem } from '@/types';
import { MailIcon } from 'lucide-react';
import { websiteConfig } from './website';

/**
 * Get social config
 * 
 * NOTICE: used in client components only
 *
 * @returns The social config
 */
export function getSocialConfig(): MenuItem[] {
  const socialLinks: MenuItem[] = [];

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
