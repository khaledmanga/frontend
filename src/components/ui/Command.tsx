import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Command({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="command" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
