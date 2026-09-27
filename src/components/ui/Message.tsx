import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Message({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="message" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
