import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function ContextMenu({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="contextmenu" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
