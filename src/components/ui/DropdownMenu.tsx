import { useState, type ReactNode } from "react";
import { cn } from "@/helpers/utils";
export function DropdownMenu({ trigger, children }: { trigger: ReactNode; children: ReactNode }) { const [open, setOpen] = useState(false); return <div className="relative"><button type="button" onClick={() => setOpen(!open)}>{trigger}</button>{open && <div className="absolute right-0 z-20 mt-2 min-w-40 rounded-xl border border-border bg-surface p-1 shadow-lg" onClick={() => setOpen(false)}>{children}</div>}</div>; }
export function DropdownItem({ children, onClick }: { children: ReactNode; onClick?: () => void }) { return <button type="button" onClick={onClick} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-black/5">{children}</button>; }
