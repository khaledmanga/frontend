import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Collapsible({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="collapsible" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
