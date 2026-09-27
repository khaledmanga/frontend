import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Calendar({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="calendar" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
