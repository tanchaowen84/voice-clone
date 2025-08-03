'use client';

import { NeumorphicModeSwitch } from '@/components/voice-clone/neumorphic-mode-switch';
import { VoiceInputArea } from '@/components/voice-clone/voice-input-area';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('HomePage.hero');

  return (
    <>
      <main id="hero" className="overflow-hidden relative">
        {/* SVG Wave Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 590"
            xmlns="http://www.w3.org/2000/svg"
            className="transition duration-300 ease-in-out delay-150 absolute inset-0 w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="5%" stopColor="#F78DA7" />
                <stop offset="95%" stopColor="#8ED1FC" />
              </linearGradient>
            </defs>
            <path
              d="M 0,600 L 0,150 C 102.30622009569379,191.70334928229664 204.61244019138758,233.4066985645933 311,218 C 417.3875598086124,202.5933014354067 527.8564593301435,130.07655502392345 622,122 C 716.1435406698565,113.92344497607657 793.9617224880384,170.28708133971293 883,168 C 972.0382775119616,165.71291866028707 1072.2966507177034,104.77511961722487 1167,92 C 1261.7033492822966,79.22488038277513 1350.8516746411483,114.61244019138756 1440,150 L 1440,600 L 0,600 Z"
              stroke="none"
              strokeWidth="0"
              fill="url(#gradient)"
              fillOpacity="0.53"
              className="transition-all duration-300 ease-in-out delay-150 path-0"
            />
            <path
              d="M 0,600 L 0,350 C 113.57894736842107,377.39712918660285 227.15789473684214,404.7942583732057 316,421 C 404.84210526315786,437.2057416267943 468.9473684210526,442.2200956937799 563,423 C 657.0526315789474,403.7799043062201 781.0526315789473,360.32535885167465 871,336 C 960.9473684210527,311.67464114832535 1016.8421052631579,306.47846889952154 1106,312 C 1195.157894736842,317.52153110047846 1317.578947368421,333.7607655502392 1440,350 L 1440,600 L 0,600 Z"
              stroke="none"
              strokeWidth="0"
              fill="url(#gradient)"
              fillOpacity="1"
              className="transition-all duration-300 ease-in-out delay-150 path-1"
            />
          </svg>
        </div>

        {/* background, light shadows on top of the hero section */}
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block z-10"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section className="relative z-20">
          <div className="relative pt-12">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                {/* title with gradient */}
                <h1 className="mt-8 text-balance text-4xl font-bricolage-grotesque lg:text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                  {t('title')}
                </h1>

                {/* description */}
                <p className="mx-auto mt-6 max-w-5xl text-balance text-xl text-foreground leading-relaxed">
                  {t('description')}
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
