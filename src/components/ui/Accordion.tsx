import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Accordion({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="accordion" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
