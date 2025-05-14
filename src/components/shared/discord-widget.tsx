'use client';

import { DiscordIcon } from '@/components/icons/discord';
import WidgetBot from '@widgetbot/react-embed';
import { useEffect, useRef, useState } from 'react';

const WIDGET_WIDTH = 800;
const WIDGET_HEIGHT = 600;
const ICON_SIZE = 48;

/**
 * Discord Widget, shows the channels and messages in the discord server
 */
export default function DiscordWidget() {
  const serverId = process.env.NEXT_PUBLIC_DISCORD_WIDGET_SERVER_ID as string;
  const channelId = process.env.NEXT_PUBLIC_DISCORD_WIDGET_CHANNEL_ID as string;
  if (!serverId || !channelId) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

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
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
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
          style={{ width: WIDGET_WIDTH, height: WIDGET_HEIGHT }}
        >
          <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
            <WidgetBot
              server={serverId}
              channel={channelId}
              width={WIDGET_WIDTH}
              height={WIDGET_HEIGHT}
            />
          </div>
        </div>
      )}
    </div>
  );
}
