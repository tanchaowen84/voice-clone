import { ImageWrapper } from '@/components/docs/image-wrapper';
import { Wrapper } from '@/components/docs/wrapper';
import { YoutubeVideo } from '@/components/docs/youtube-video';
import { MDXContent } from '@content-collections/mdx/react';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as LucideIcons from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, FC } from 'react';

interface CustomMDXContentProps {
  code: string;
  customComponents?: Record<string, any>;
  includeFumadocsComponents?: boolean;
}

/**
 * Enhanced MDX Content component that includes commonly used MDX components
 * It can be used for blog posts, documentation, and custom pages
 */
export async function CustomMDXContent({
  code,
  customComponents = {},
  includeFumadocsComponents = true,
}: CustomMDXContentProps) {
  // Start with default components
  const baseComponents: Record<string, any> = {
    ...defaultMdxComponents,
    ...LucideIcons,
    ...((await import('lucide-react')) as unknown as MDXComponents),
    YoutubeVideo,
    ...customComponents,
  };

  // Add Fumadocs UI components if requested
  if (includeFumadocsComponents) {
    Object.assign(baseComponents, {
      Tabs,
      Tab,
      TypeTable,
      Accordion,
      Accordions,
      Steps,
      Step,
      Wrapper,
      File,
      Folder,
      Files,
      blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
      img: ImageWrapper,
    });
  }

  return (
    <MDXContent code={code} components={baseComponents as MDXComponents} />
  );
}
