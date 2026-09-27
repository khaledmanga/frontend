import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Direction({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="direction" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
