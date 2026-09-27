import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Avatar({ src, alt, className, ...props }: ImgHTMLAttributes<HTMLImageElement>) { return <img src={src ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(alt ?? "User")}`} alt={alt} className={cn("h-9 w-9 rounded-full bg-[#e4eee9] object-cover", className)} {...props} />; }
