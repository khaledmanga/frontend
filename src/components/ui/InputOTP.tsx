import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function InputOTP({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="inputotp" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
