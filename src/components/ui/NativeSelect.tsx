import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function NativeSelect({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="nativeselect" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
