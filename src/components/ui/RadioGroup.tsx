import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function RadioGroup({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="radiogroup" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
