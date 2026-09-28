import axios from "axios";
import type { AuthUser, Credentials, RegistrationDetails } from "@/@types/auth";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { API_ERROR_FIELDS, API_FIELDS } from "@/constants/apiFields";
import { HttpStatus } from "@/constants/httpStatus";
import { MESSAGES } from "@/constants/messages";
import { VALUE_TYPES } from "@/constants/valueTypes";
import { apiHttp } from "./http";

export class InvalidAuthResponseError extends Error {
  constructor() {
    super(MESSAGES.invalidAuthResponse);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === VALUE_TYPES.Object && value !== null;
}

export function normalizeAuthUser(
  data: unknown,
  fallback?: { email?: string; name?: string },
): AuthUser {
  const response = isRecord(data) ? data : {};
  const source = isRecord(response[API_FIELDS.User])
    ? response[API_FIELDS.User]
    : response;
  const id =
    typeof source[API_FIELDS.Id] === VALUE_TYPES.String ||
    typeof source[API_FIELDS.Id] === VALUE_TYPES.Number
      ? String(source[API_FIELDS.Id])
      : null;
  const email =
    typeof source[API_FIELDS.Email] === VALUE_TYPES.String &&
    source[API_FIELDS.Email].trim()
      ? source[API_FIELDS.Email]
      : fallback?.email;
  const name =
    (typeof source[API_FIELDS.Name] === VALUE_TYPES.String &&
    source[API_FIELDS.Name].trim()
      ? source[API_FIELDS.Name]
      : typeof source[API_FIELDS.Username] === VALUE_TYPES.String &&
          source[API_FIELDS.Username].trim()
        ? source[API_FIELDS.Username]
        : fallback?.name?.trim()) ||
    (email ? email.split("@")[0] : null);
  if (!id || !email || !name) {
    throw new InvalidAuthResponseError();
  }
  return {
    id,
    email,
    name,
  };
}

export async function loginApi(credentials: Credentials): Promise<AuthUser> {
  const response = await apiHttp.post<unknown>(
    API_ENDPOINTS.AUTH_LOGIN,
    credentials,
  );
  return normalizeAuthUser(response.data, credentials);
}

export async function registerApi(
  details: RegistrationDetails,
): Promise<AuthUser> {
  const response = await apiHttp.post<unknown>(API_ENDPOINTS.AUTH_REGISTER, {
    [API_FIELDS.Email]: details.email,
    [API_FIELDS.Password]: details.password,
    [API_FIELDS.Username]: details.name,
  });
  return normalizeAuthUser(response.data, details);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiHttp.get<unknown>(API_ENDPOINTS.AUTH_ME);
  return normalizeAuthUser(response.data);
}

export async function logoutApi(): Promise<void> {
  await apiHttp.post(API_ENDPOINTS.AUTH_LOGOUT);
}

function getServerErrorMessage(data: unknown): string | null {
  if (typeof data === VALUE_TYPES.String) {
    const text = data.trim();
    if (!text) return null;
    try {
      data = JSON.parse(text);
    } catch {
      return text;
    }
  }
  if (!isRecord(data)) return null;

  for (const key of API_ERROR_FIELDS) {
    const message = Object.entries(data).find(([field]) => field === key)?.[1];
    if (typeof message === VALUE_TYPES.String && message.trim()) return message.trim();
  }
  return null;
}

export function getAuthErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof InvalidAuthResponseError
      ? MESSAGES.invalidAuthResponse
      : MESSAGES.unexpectedError;
  }
  if (!error.response)
    return MESSAGES.cannotReachServer;
  if (error.response.status === HttpStatus.Unauthorized) {
    return MESSAGES.invalidCredentials;
  }
  if (error.response.status === HttpStatus.Conflict) {
    return MESSAGES.existingAccount;
  }
  const serverMessage = getServerErrorMessage(error.response.data);
  if (serverMessage) return serverMessage;
  switch (error.response.status) {
    case HttpStatus.BadRequest:
      return MESSAGES.invalidAuthForm;
    case HttpStatus.Forbidden:
      return MESSAGES.permissionDenied;
    case HttpStatus.UnprocessableEntity:
      return MESSAGES.invalidSubmission;
    case HttpStatus.TooManyRequests:
      return MESSAGES.tooManyAttempts;
    default:
      return error.response.status >= HttpStatus.InternalServerError
        ? MESSAGES.serverUnavailable
        : MESSAGES.requestFailed;
  }
}
