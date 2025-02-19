import * as React from 'react';
import { cn } from '@/lib/utils';

export type GridSectionProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  hideVerticalGridLines?: boolean;
  hideBottomGridLine?: boolean;
  containerProps?: React.HtmlHTMLAttributes<HTMLDivElement>;
};

/**
 * TODO: remove
 */
export function GridSection({
  children,
  hideVerticalGridLines,
  hideBottomGridLine,
  containerProps: { className = '', ...containerProps } = {},
  ...other
}: GridSectionProps): React.JSX.Element {
  return (
    <section {...other}>
      <div
        className={cn('px-2 sm:container', className)}
        {...containerProps}
      >
        <div className="relative grid">
          {!hideVerticalGridLines && (
            <>
              <div className="absolute inset-y-0 block w-px bg-border" />
              <div className="absolute inset-y-0 right-0 w-px bg-border" />
            </>
          )}
          {children}
        </div>
      </div>
      {!hideBottomGridLine && <div className="h-px w-full bg-border" />}
    </section>
  );
}
