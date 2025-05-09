import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import type { ComponentProps, FC } from 'react';

interface ImageWrapperProps extends ComponentProps<'img'> {
  src: string;
  alt?: string;
}

export const ImageWrapper = ({ src, alt }: ImageWrapperProps) => {
  if (!src) {
    return null;
  }

  return (
    <ImageZoom
      src={src}
      alt={alt || 'image'}
      width={1400}
      height={787}
      style={{
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
      }}
      priority
    />
  );
};
