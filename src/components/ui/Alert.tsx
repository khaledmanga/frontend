import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div role="alert" data-slot="alert" className={cn("rounded-lg border border-border bg-orange-50 p-3 text-sm", className)} {...props} />; }
