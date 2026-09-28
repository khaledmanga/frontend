import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/Card";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="grid min-h-[calc(100vh-68px)] place-items-center p-5">
        <Card unstyled className="w-full max-w-md">{children}</Card>
      </main>
    </>
  );
}
