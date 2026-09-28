import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { BUTTON_SIZES, BUTTON_VARIANTS } from "@/constants/ui";
import { cn } from "@/helpers/utils";

const button = cva("inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50", {
  variants: { variant: { [BUTTON_VARIANTS.Default]: "bg-accent text-white hover:bg-[#285f54]", [BUTTON_VARIANTS.Secondary]: "border border-border bg-transparent hover:bg-[#f3f6f3]", [BUTTON_VARIANTS.Ghost]: "hover:bg-[#f3f6f3]", [BUTTON_VARIANTS.Link]: "text-accent underline-offset-4 hover:underline", [BUTTON_VARIANTS.Destructive]: "bg-red-600 text-white", [BUTTON_VARIANTS.CallToAction]: "bg-foreground text-white hover:bg-[#3b3b3b]", [BUTTON_VARIANTS.Unstyled]: "" }, size: { [BUTTON_SIZES.Small]: "h-8 px-3 text-xs", [BUTTON_SIZES.Medium]: "h-10 px-4 text-sm", [BUTTON_SIZES.Large]: "h-12 px-6", [BUTTON_SIZES.Icon]: "h-10 w-10" } },
  defaultVariants: { variant: BUTTON_VARIANTS.Default, size: BUTTON_SIZES.Medium },
});
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => <button ref={ref} data-slot="button" className={cn(variant === BUTTON_VARIANTS.Unstyled ? undefined : button({ variant, size }), className)} {...props} />);
Button.displayName = "Button";
