'use client';

import { websiteConfig } from '@/config/website';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  const theme = useTheme();
  const logoLight = websiteConfig.metadata.logoLight ?? '/logo.png';
  const logoDark = websiteConfig.metadata.logoDark ?? logoLight;
  const logo = theme.theme === 'dark' ? logoDark : logoLight;

  return (
    <Image
      src={logo}
      alt="Logo"
      title="Logo"
      width={96}
      height={96}
      className={cn('size-8 rounded-md', className)}
    />
  );
}
