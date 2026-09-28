import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function Typography({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="typography" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
