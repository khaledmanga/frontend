import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/helpers/utils';

export function Carousel({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return <div data-slot="carousel" className={cn('rounded-lg', className)} {...props}>{children}</div>;
}
