import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function InputGroup({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="inputgroup" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
