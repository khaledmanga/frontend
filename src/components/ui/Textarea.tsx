import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/helpers/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { unstyled?: boolean };
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, unstyled, ...props }, ref) => <textarea ref={ref} data-slot="textarea" className={cn(unstyled ? undefined : "min-h-28 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20", className)} {...props} />);
Textarea.displayName = "Textarea";
