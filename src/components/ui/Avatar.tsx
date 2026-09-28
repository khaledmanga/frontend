import type { ImgHTMLAttributes } from "react";
import { ASSET_URLS } from "@/constants/assets";
import { MESSAGES } from "@/constants/messages";
import { cn } from "@/helpers/utils";
export function Avatar({ src, alt, className, ...props }: ImgHTMLAttributes<HTMLImageElement>) { return <img src={src ?? ASSET_URLS.InitialsAvatar(alt ?? MESSAGES.user)} alt={alt} className={cn("h-9 w-9 rounded-full bg-[#e4eee9] object-cover", className)} {...props} />; }
