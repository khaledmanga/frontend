import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/helpers/utils";
export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => <label ref={ref} data-slot="label" className={cn("text-sm font-semibold", className)} {...props} />);
Label.displayName = "Label";
