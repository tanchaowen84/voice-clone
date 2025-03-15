import { cn } from '@/lib/utils';

interface DividerWithTextProps {
  text: string;
  className?: string;
}

/**
 * A horizontal divider with text in the middle
 */
export const DividerWithText = ({
  text,
  className,
}: DividerWithTextProps) => {
  return (
    <div className={cn('relative flex items-center py-5', className)}>
      <div className="flex-grow border-t border-border"></div>
      <span className="flex-shrink mx-4 text-sm text-muted-foreground">
        {text}
      </span>
      <div className="flex-grow border-t border-border"></div>
    </div>
  );
}; 