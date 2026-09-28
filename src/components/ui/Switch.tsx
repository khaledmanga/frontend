import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function Switch({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="switch" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
