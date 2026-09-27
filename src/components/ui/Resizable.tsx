import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Resizable({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="resizable" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
