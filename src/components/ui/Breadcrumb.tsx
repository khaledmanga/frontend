import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function Breadcrumb({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="breadcrumb" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
