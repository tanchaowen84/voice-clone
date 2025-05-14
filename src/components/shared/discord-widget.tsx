'use client';

import WidgetBot from '@widgetbot/react-embed';
import type React from 'react';

const DiscordWidget: React.FC = () => {
  return (
    <WidgetBot
      server="1300839113142046730"
      channel="1366205519965982912"
      width="800"
      height="600"
    />
  );
};

export default DiscordWidget;
