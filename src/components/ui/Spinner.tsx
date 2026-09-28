import { MESSAGES } from "@/constants/messages";

export function Spinner() { return <span data-slot="spinner" aria-label={MESSAGES.loadingLabel} className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />; }
