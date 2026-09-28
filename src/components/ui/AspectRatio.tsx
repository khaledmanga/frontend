import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function AspectRatio({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="aspectratio" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
