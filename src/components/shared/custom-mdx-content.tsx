import { Wrapper } from '@/components/docs/preview/wrapper';
import { UiOverview } from '@/components/docs/ui-overview';
import { MDXContent } from '@content-collections/mdx/react';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ComponentProps, FC } from 'react';

interface CustomMDXContentProps {
  code: string;
  customComponents?: Record<string, any>;
  includeFumadocsComponents?: boolean;
}

/**
 * Enhanced MDX Content component that includes commonly used MDX components
 * It can be used for blog posts, documentation, and custom pages
 */
export function CustomMDXContent({
  code,
  customComponents = {},
  includeFumadocsComponents = true,
}: CustomMDXContentProps) {
  // Start with default components
  const baseComponents: Record<string, any> = {
    ...defaultMdxComponents,
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
      Wrapper,
      File,
      Folder,
      Files,
      blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
      UiOverview,
    });
  }

  return (
    <MDXContent
      code={code}
      components={baseComponents as MDXComponents}
    />
  );
} 