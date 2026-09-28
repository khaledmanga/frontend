import type { HTMLAttributes } from "react";
import { cn } from "@/helpers/utils";
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) { return <span data-slot="badge" className={cn("inline-flex items-center rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-muted", className)} {...props} />; }
