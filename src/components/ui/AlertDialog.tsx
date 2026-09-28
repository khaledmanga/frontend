import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function AlertDialog({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="alertdialog" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
