import type { ReactNode } from "react";
export function Tabs({ tabs, value, onChange }: { tabs: { value: string; label: string }[]; value: string; onChange: (value: string) => void }) { return <div className="flex gap-1 rounded-xl bg-black/5 p-1">{tabs.map((tab) => <button type="button" key={tab.value} onClick={() => onChange(tab.value)} className={`rounded-lg px-4 py-2 text-sm ${value === tab.value ? "bg-surface font-semibold shadow-sm" : "text-muted"}`}>{tab.label}</button>)}</div>; }
export function TabsContent({ children }: { children: ReactNode }) { return <div>{children}</div>; }
