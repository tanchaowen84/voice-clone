'use client';

import { VoiceInputArea } from '@/components/voice-clone/voice-input-area';
import { NeumorphicModeSwitch } from '@/components/voice-clone/neumorphic-mode-switch';

export default function HeroSection() {
  return (
    <>
      <main id="hero" className="overflow-hidden">
        {/* background, light shadows on top of the hero section */}
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section>
          <div className="relative pt-12">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                {/* title with gradient */}
                <h1 className="mt-8 text-balance text-4xl font-bricolage-grotesque lg:text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                  Lightning-Fast AI Voice Cloning
                </h1>

                {/* description */}
                <p className="mx-auto mt-6 max-w-5xl text-balance text-xl text-foreground leading-relaxed">
                  Transform text prompts into stunning voice clones in seconds.
                  Free to start, no login required.
                </p>
              </div>
            </div>

            {/* Main Interface */}
            <div className="mt-12 px-4">
              <div className="max-w-5xl mx-auto">
                {/* Voice Mode Switch */}
                <NeumorphicModeSwitch />

                {/* Dynamic Content Area */}
                <VoiceInputArea />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
