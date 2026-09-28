import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/helpers/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { unstyled?: boolean };
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, unstyled, ...props }, ref) => <input ref={ref} data-slot="input" className={cn(unstyled ? undefined : "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20", className)} {...props} />);
Input.displayName = "Input";
