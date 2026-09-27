import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Kbd({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="kbd" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
