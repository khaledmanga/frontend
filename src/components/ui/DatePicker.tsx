import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function DatePicker({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="datepicker" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
