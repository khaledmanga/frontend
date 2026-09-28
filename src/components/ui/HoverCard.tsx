import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function HoverCard({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="hovercard" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
