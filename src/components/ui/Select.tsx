import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Select({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="select" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
