import { Toaster as SonnerToaster, toast } from "sonner";

export { toast };
export function Toaster() {
  return <SonnerToaster position="bottom-right" richColors />;
}
