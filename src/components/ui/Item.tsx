import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Item({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="item" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
