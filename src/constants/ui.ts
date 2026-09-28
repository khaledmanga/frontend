export const BUTTON_VARIANTS = {
  Default: "default",
  Secondary: "secondary",
  Ghost: "ghost",
  Link: "link",
  Destructive: "destructive",
  CallToAction: "cta",
  Unstyled: "unstyled",
} as const;
export type ButtonVariant =
  (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];

export const BUTTON_SIZES = {
  Small: "sm",
  Medium: "md",
  Large: "lg",
  Icon: "icon",
} as const;
export type ButtonSize = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];
