import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Drawer({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="drawer" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
