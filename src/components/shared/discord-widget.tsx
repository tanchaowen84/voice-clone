'use client';

import { DiscordIcon } from '@/components/icons/discord';
import { websiteConfig } from '@/config/website';
import { useMediaQuery } from '@/hooks/use-media-query';
import WidgetBot from '@widgetbot/react-embed';
import { useEffect, useRef, useState } from 'react';

/**
 * Discord Widget, shows the channels and messages in the discord server
 *
 * https://docs.widgetbot.io/embed/react-embed/
 */
export default function DiscordWidget() {
  if (!websiteConfig.features.enableDiscordWidget) {
    return null;
  }

  const serverId = process.env.NEXT_PUBLIC_DISCORD_WIDGET_SERVER_ID as string;
  const channelId = process.env.NEXT_PUBLIC_DISCORD_WIDGET_CHANNEL_ID as string;
  if (!serverId || !channelId) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const { device, width: windowWidth, height: windowHeight } = useMediaQuery();

  let widgetWidth = 800;
  let widgetHeight = 600;
  if (device === 'mobile') {
    widgetWidth = windowWidth ? Math.floor(windowWidth * 0.9) : 320;
    widgetHeight = windowHeight ? Math.floor(windowHeight * 0.8) : 400;
  } else if (device === 'tablet' || device === 'sm') {
    widgetWidth = windowWidth ? Math.floor(windowWidth * 0.9) : 600;
    widgetHeight = windowHeight ? Math.floor(windowHeight * 0.8) : 480;
  }

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div>
      {/* discord icon button, show in bottom right corner */}
      {!open && (
        <button
          aria-label="Open Discord Widget"
          className="fixed bottom-[84px] right-10 z-50 cursor-pointer flex items-center justify-center rounded-full bg-[#5865F2] shadow-lg
            hover:scale-110 transition-transform duration-150"
          style={{ width: 48, height: 48 }}
          onClick={() => setOpen(true)}
          type="button"
        >
          <DiscordIcon width={32} height={32} className="text-white" />
        </button>
      )}

      {/* discord widget expand layer */}
      {open && (
        <div
          ref={widgetRef}
          className="fixed bottom-[84px] right-10 z-50 flex flex-col items-end"
          style={{ width: widgetWidth, height: widgetHeight }}
        >
          <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
            <WidgetBot
              server={serverId}
              channel={channelId}
              width={widgetWidth}
              height={widgetHeight}
            />
          </div>
        </div>
      )}
    </div>
  );
}
