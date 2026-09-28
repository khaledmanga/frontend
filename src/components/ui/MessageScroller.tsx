import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function MessageScroller({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="messagescroller" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
