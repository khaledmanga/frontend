import { MESSAGES } from "@/constants/messages";

export const apiBaseURL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ??
  (import.meta.env.DEV ? "http://localhost:8080/api" : undefined);

if (!apiBaseURL) {
  throw new Error(MESSAGES.apiUrlRequired);
}
