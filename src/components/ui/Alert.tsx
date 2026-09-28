import type { HTMLAttributes } from "react";
import { cn } from "@/helpers/utils";

type AlertProps = HTMLAttributes<HTMLDivElement> & { unstyled?: boolean };
export function Alert({ className, unstyled, ...props }: AlertProps) { return <div role="alert" data-slot="alert" className={cn(unstyled ? undefined : "rounded-lg border border-border bg-orange-50 p-3 text-sm", className)} {...props} />; }
