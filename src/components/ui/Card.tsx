import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div data-slot="card" className={cn("rounded-sm border border-border bg-surface shadow-none", className)} {...props} />; }
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div data-slot="card-header" className={cn("p-5 pb-3", className)} {...props} />; }
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div data-slot="card-content" className={cn("p-5 pt-2", className)} {...props} />; }
