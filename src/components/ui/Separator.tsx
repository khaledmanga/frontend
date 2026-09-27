import type { HTMLAttributes } from "react";
export function Separator({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div role="separator" data-slot="separator" className={`h-px w-full bg-border ${className}`} {...props} />; }
