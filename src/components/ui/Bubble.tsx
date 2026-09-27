import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Bubble({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="bubble" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
