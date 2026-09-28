import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function NavigationMenu({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="navigationmenu" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
