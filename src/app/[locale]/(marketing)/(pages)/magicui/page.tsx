import { BentoDemo } from '@/components/magicui/example/bento-grid-example';
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
      <HeroVideoDialogDemoTopInBottomOut />
      <BentoDemo />
      <MarqueeDemoVertical />
    </div>
  );
}
