import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="grid min-h-[calc(100vh-68px)] place-items-center p-5">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </>
  );
}
