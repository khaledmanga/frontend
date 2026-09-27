import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function DataTable({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="datatable" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
