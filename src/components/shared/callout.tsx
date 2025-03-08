import * as React from 'react';
import { ComponentProps } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';

type CalloutProps = ComponentProps<typeof Alert> & {
  icon?: string;
  title?: string;
};

/**
 * TODO: update
 */
export function Callout({
  title,
  children,
  icon,
  ...props
}: CalloutProps): React.JSX.Element {
  return (
    <Alert {...props}>
      {icon && <span className="mr-4 text-2xl">{icon}</span>}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
