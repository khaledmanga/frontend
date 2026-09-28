import type { ReactNode } from "react";
import { MESSAGES } from "@/constants/messages";
import { BUTTON_SIZES, BUTTON_VARIANTS } from "@/constants/ui";
import { Button } from "./Button";
export function Dialog({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; children: ReactNode }) { if (!open) return null; return <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onMouseDown={() => onOpenChange(false)}><div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">{title}</h2><Button variant={BUTTON_VARIANTS.Ghost} size={BUTTON_SIZES.Icon} aria-label={MESSAGES.close} onClick={() => onOpenChange(false)}>×</Button></div>{children}</div></div>; }
