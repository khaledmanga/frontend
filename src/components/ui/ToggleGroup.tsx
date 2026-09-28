import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function ToggleGroup({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="togglegroup" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
