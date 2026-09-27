import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Empty({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="empty" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
