import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Tooltip({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="tooltip" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
