import { forwardRef, type InputHTMLAttributes } from "react";
export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => <input ref={ref} type="checkbox" data-slot="checkbox" className="h-4 w-4 accent-accent" {...props} />);
Checkbox.displayName = "Checkbox";
