import axios from "axios";
import type {
  AuthUser,
  Credentials,
  RegistrationDetails,
} from "@/store/auth/authTypes";
import { apiHttp } from "./http";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeAuthUser(
  data: unknown,
  fallback?: { email?: string; name?: string },
): AuthUser {
  const response = isRecord(data) ? data : {};
  const source = isRecord(response.user) ? response.user : response;
  const id =
    typeof source.id === "string" || typeof source.id === "number"
      ? String(source.id)
      : null;
  const email =
    typeof source.email === "string" && source.email.trim()
      ? source.email
      : fallback?.email;
  const name =
    (typeof source.name === "string" && source.name.trim()
      ? source.name
      : typeof source.username === "string" && source.username.trim()
        ? source.username
        : fallback?.name?.trim()) ||
    (email ? email.split("@")[0] : null);
  if (!id || !email || !name) {
    throw new Error("The authentication service returned an invalid response.");
  }
  return {
    id,
    email,
    name,
  };
}

export async function loginApi(credentials: Credentials): Promise<AuthUser> {
  const response = await apiHttp.post<unknown>("/auth/login", credentials);
  return normalizeAuthUser(response.data, credentials);
}

export async function registerApi(
  details: RegistrationDetails,
): Promise<AuthUser> {
  const response = await apiHttp.post<unknown>("/auth/register", {
    email: details.email,
    password: details.password,
    username: details.name,
  });
  return normalizeAuthUser(response.data, details);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiHttp.get<unknown>("/auth/me");
  return normalizeAuthUser(response.data);
}

export async function logoutApi(): Promise<void> {
  await apiHttp.post("/auth/logout");
}

function getServerErrorMessage(data: unknown): string | null {
  if (typeof data === "string") {
    const text = data.trim();
    if (!text) return null;
    try {
      data = JSON.parse(text);
    } catch {
      return text;
    }
  }
  if (!isRecord(data)) return null;

  for (const key of ["error", "message"]) {
    const message = Object.entries(data).find(([field]) => field === key)?.[1];
    if (typeof message === "string" && message.trim()) return message.trim();
  }
  return null;
}

export function getAuthErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error &&
      error.message ===
        "The authentication service returned an invalid response."
      ? error.message
      : "Something went wrong. Please try again.";
  }
  if (!error.response)
    return "Unable to reach the server. Check your connection and try again.";
  if (error.response.status === 401) {
    return "Your email or password is incorrect.";
  }
  if (error.response.status === 409) {
    return "An account with this email already exists.";
  }
  const serverMessage = getServerErrorMessage(error.response.data);
  if (serverMessage) return serverMessage;
  switch (error.response.status) {
    case 400:
      return "Please check the information you entered and try again.";
    case 403:
      return "You don't have permission to do that.";
    case 422:
      return "Some of the information you entered is invalid.";
    case 429:
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return error.response.status >= 500
        ? "The server is temporarily unavailable. Please try again later."
        : "Unable to complete your request. Please try again.";
  }
}
