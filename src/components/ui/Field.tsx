import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Field({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="field" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
