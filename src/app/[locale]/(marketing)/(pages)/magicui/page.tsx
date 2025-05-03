import Container from '@/components/layout/container';
import { AnimatedGradientTextDemo } from '@/components/magicui/example/animated-gradient-text-example';
import { AnimatedGridPatternDemo } from '@/components/magicui/example/animated-grid-pattern-example';
import { AnimatedListDemo } from '@/components/magicui/example/animated-list-example';
import { AnimatedShinyTextDemo } from '@/components/magicui/example/animated-shiny-text-example';
import { AnimatedSubscribeButtonDemo } from '@/components/magicui/example/animated-subscribe-button-example';
import { AvatarCirclesDemo } from '@/components/magicui/example/avatar-circles-example';
import { BentoDemo } from '@/components/magicui/example/bento-grid-example';
import { BlurFadeDemo } from '@/components/magicui/example/blur-fade-example';
import { DotPatternDemo } from '@/components/magicui/example/dot-pattern-example';
import { GridPatternDemo } from '@/components/magicui/example/grid-pattern-example';
import { HeroVideoDialogDemoTopInBottomOut } from '@/components/magicui/example/hero-video-dialog-example';
import { HyperTextDemo } from '@/components/magicui/example/hyper-text-example';
import { InteractiveGridPatternDemo } from '@/components/magicui/example/interactive-grid-pattern-example';
import { InteractiveHoverButtonDemo } from '@/components/magicui/example/interactive-hover-button-example';
import { MarqueeDemoVertical } from '@/components/magicui/example/marquee-example';
import { NumberTickerDemo } from '@/components/magicui/example/number-ticker-example';
import { PulsatingButtonDemo } from '@/components/magicui/example/pulsating-button-example';
import { RainbowButtonDemo } from '@/components/magicui/example/rainbow-button-example';
import { RippleDemo } from '@/components/magicui/example/ripple-example';
import { ShimmerButtonDemo } from '@/components/magicui/example/shimmer-button-example';
import { ShinyButtonDemo } from '@/components/magicui/example/shiny-button-example';
import { TweetCardDemo } from '@/components/magicui/example/twitter-card-example';
import { WordRotateDemo } from '@/components/magicui/example/word-rotate-example';

/**
 * Magic UI Components Showcase Page
 *
 * https://magicui.design/docs/components
 */
export default async function MagicuiPage() {
  return (
    <Container className="py-16 px-4">
      <div className="mx-auto space-y-8">
        <RippleDemo />
        <div className="grid md:grid-cols-2 gap-4">
          <MarqueeDemoVertical />
          <AnimatedListDemo />
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="flex items-center justify-center">
            <AvatarCirclesDemo />
          </div>
          <div className="flex items-center justify-center">
            <AnimatedGradientTextDemo />
          </div>
          <div className="flex items-center justify-center">
            <AnimatedShinyTextDemo />
          </div>
          <div className="flex items-center justify-center">
            <AnimatedSubscribeButtonDemo />
          </div>
          <div className="flex items-center justify-center">
            <ShimmerButtonDemo />
          </div>
          <div className="flex items-center justify-center">
            <ShinyButtonDemo />
          </div>
          <div className="flex items-center justify-center">
            <RainbowButtonDemo />
          </div>
          <div className="flex items-center justify-center">
            <PulsatingButtonDemo />
          </div>
          <div className="flex items-center justify-center">
            <NumberTickerDemo />
          </div>
          <div className="flex items-center justify-center">
            <InteractiveHoverButtonDemo />
          </div>
          <div className="flex items-center justify-center">
            <HyperTextDemo />
          </div>
          <div className="flex items-center justify-center">
            <WordRotateDemo />
          </div>
        </div>
        <TweetCardDemo id="1678577280489234432" />
        <BlurFadeDemo />
        <BentoDemo />
        <DotPatternDemo />
        <GridPatternDemo />
        <AnimatedGridPatternDemo />
        <InteractiveGridPatternDemo />
        <HeroVideoDialogDemoTopInBottomOut />
      </div>
    </Container>
  );
}
