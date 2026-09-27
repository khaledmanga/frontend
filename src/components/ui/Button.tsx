import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva("inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50", {
  variants: { variant: { default: "bg-accent text-white hover:bg-[#285f54]", secondary: "border border-border bg-transparent hover:bg-[#f3f6f3]", ghost: "hover:bg-[#f3f6f3]", link: "text-accent underline-offset-4 hover:underline", destructive: "bg-red-600 text-white", cta: "bg-foreground text-white hover:bg-[#3b3b3b]" }, size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-6", icon: "h-10 w-10" } },
  defaultVariants: { variant: "default", size: "md" },
});
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => <button ref={ref} data-slot="button" className={cn(button({ variant, size }), className)} {...props} />);
Button.displayName = "Button";
