import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Marker({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="marker" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
