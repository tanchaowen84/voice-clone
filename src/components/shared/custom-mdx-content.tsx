import { Wrapper } from '@/components/docs/wrapper';
import { MDXContent } from '@content-collections/mdx/react';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Callout } from 'fumadocs-ui/components/callout';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
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
export async function CustomMDXContent({
  code,
  customComponents = {},
  includeFumadocsComponents = true,
}: CustomMDXContentProps) {
  // Start with default components
  const baseComponents: Record<string, any> = {
    ...defaultMdxComponents,
    ...((await import('lucide-react')) as unknown as MDXComponents),
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
      img: (props: ComponentProps<'img'>) => {
        if (!props.src) {
          return null;
        }
        
        return (
          <ImageZoom 
            src={props.src} 
            alt={props.alt || "image"}
            width={1400}
            height={787}
            style={{ 
              width: '100%',
              height: 'auto',
              objectFit: 'contain' 
            }}
            priority
          />
        );
      },
    });
  }

  return (
    <MDXContent
      code={code}
      components={baseComponents as MDXComponents}
    />
  );
} 