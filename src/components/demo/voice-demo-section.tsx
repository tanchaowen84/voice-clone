'use client';

import { getAssetUrl } from '@/config/cdn-config';
import { VoiceDemoCard } from './voice-demo-card';

// 预设的音色数据（映射到 /public/audio 下的真实文件名）
const voiceDemos = [
  {
    id: 'Voice_1754057031732',
    name: 'alexander',
    description:
      'Deep mature American male voice, perfect for professional narration and podcasts.',
    avatarGradient:
      'bg-gradient-to-br from-cyan-300 via-blue-400 via-teal-400 to-green-400 shadow-2xl shadow-cyan-400/50 ring-2 ring-cyan-400/20',
    audioUrl: '/audio/alexander.mp3',
  },
  {
    id: 'Voice_1754057862989',
    name: 'lisa',
    description:
      'Warm and friendly female voice with British accent, ideal for storytelling.',
    avatarGradient:
      'bg-gradient-to-br from-gray-50 via-gray-200 via-slate-300 to-gray-400 shadow-2xl shadow-gray-300/60 ring-2 ring-gray-300/30',
    audioUrl: '/audio/lisa.mp3',
  },
  {
    id: 'Voice_1754058380520',
    name: 'marcus',
    description:
      'Rich, authoritative voice with slight gravelly texture, great for documentaries.',
    avatarGradient:
      'bg-gradient-to-br from-orange-300 via-red-400 via-pink-400 to-rose-500 shadow-2xl shadow-orange-400/50 ring-2 ring-orange-400/20',
    audioUrl: '/audio/marcus.mp3',
  },
  {
    id: 'Voice_1754058581229',
    name: 'emily',
    description:
      'Clear and articulate female voice, perfect for educational content and tutorials.',
    avatarGradient:
      'bg-gradient-to-br from-purple-300 via-indigo-400 via-blue-400 to-cyan-500 shadow-2xl shadow-purple-400/50 ring-2 ring-purple-400/20',
    audioUrl: '/audio/emily.mp3',
  },
  {
    id: 'Voice_1754058742156',
    name: 'george',
    description:
      'Conversational and approachable male voice, excellent for casual content.',
    avatarGradient:
      'bg-gradient-to-br from-yellow-300 via-amber-400 via-orange-400 to-red-500 shadow-2xl shadow-yellow-400/50 ring-2 ring-yellow-400/20',
    audioUrl: '/audio/george.mp3',
  },
  {
    id: 'Voice_1754058903847',
    name: 'evelyn',
    description:
      'Soft and melodic voice with international appeal, suitable for meditation and wellness.',
    avatarGradient:
      'bg-gradient-to-br from-pink-300 via-rose-400 via-purple-400 to-violet-500 shadow-2xl shadow-pink-400/50 ring-2 ring-pink-400/20',
    audioUrl: '/audio/evelyn.mp3',
  },
];

/**
 * Voice Demo Section Component
 * Displays a grid of voice demo cards
 */
export function VoiceDemoSection() {
  return (
    <section className="py-8 bg-zinc-950/30 rounded-2xl">
      <div className="max-w-6xl mx-auto px-4">
        {/* Voice Demo Grid - 2 rows, 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {voiceDemos.map((voice) => (
            <VoiceDemoCard
              key={voice.id}
              id={voice.id}
              name={voice.name}
              description={voice.description}
              avatarGradient={voice.avatarGradient}
              audioUrl={getAssetUrl(voice.audioUrl as string)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
