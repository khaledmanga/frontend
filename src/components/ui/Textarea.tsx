import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => <textarea ref={ref} data-slot="textarea" className={cn("min-h-28 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20", className)} {...props} />);
Textarea.displayName = "Textarea";
