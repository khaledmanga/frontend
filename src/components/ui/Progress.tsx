import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Progress({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="progress" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
