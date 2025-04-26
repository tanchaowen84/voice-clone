import { AnimatedListDemo } from '@/components/magicui/example/animated-list-example';
import { BentoDemo } from '@/components/magicui/example/bento-grid-example';
import { DotPatternDemo } from '@/components/magicui/example/dot-pattern-example';
import { GridPatternDemo } from '@/components/magicui/example/grid-pattern-example';
import { HeroVideoDialogDemoTopInBottomOut } from '@/components/magicui/example/hero-video-dialog-example';
import { MarqueeDemoVertical } from '@/components/magicui/example/marquee-example';

/**
 * Magic UI Components Showcase Page
 *
 * https://magicui.design/docs/components
 */
export default async function MagicuiPage() {
  return (
    <div className="mx-auto space-y-8">
      <DotPatternDemo />
      <GridPatternDemo />
      <BentoDemo />
      <MarqueeDemoVertical />
      <AnimatedListDemo />
      <HeroVideoDialogDemoTopInBottomOut />
    </div>
  );
}
