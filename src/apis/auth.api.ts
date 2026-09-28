import axios from "axios";
import type { AuthUser, Credentials, RegistrationDetails } from "@/@types/auth";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { API_ERROR_FIELDS, API_FIELDS } from "@/constants/apiFields";
import { HttpStatus } from "@/constants/httpStatus";
import { MESSAGES } from "@/constants/messages";
import { isNonEmptyString, isNumber, isRecord, isString } from "./utils";
import { apiHttp } from "./http";

export class InvalidAuthResponseError extends Error {
  constructor() {
    super(MESSAGES.invalidAuthResponse);
  }
}

function pickString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = record[key];
  return isNonEmptyString(value) ? value : undefined;
}

export function normalizeAuthUser(
  data: unknown,
  fallback?: { email?: string; name?: string },
): AuthUser {
  const response = isRecord(data) ? data : {};
  const userValue = response[API_FIELDS.User];
  const source = isRecord(userValue) ? userValue : response;

  const rawId = source[API_FIELDS.Id];
  const id = isString(rawId) || isNumber(rawId) ? String(rawId) : null;

  const email = pickString(source, API_FIELDS.Email) ?? fallback?.email;
  const name =
    pickString(source, API_FIELDS.Name) ??
    pickString(source, API_FIELDS.Username) ??
    (fallback?.name?.trim() || undefined) ??
    (email ? email.split("@")[0] : undefined);

  if (!id || !email || !name) {
    throw new InvalidAuthResponseError();
  }
  return { id, email, name };
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
  let parsed: unknown = data;
  if (isString(data)) {
    const text = data.trim();
    if (!text) return null;
    try {
      parsed = JSON.parse(text);
    } catch {
      return text;
    }
  }
  if (!isRecord(parsed)) return null;

  for (const key of API_ERROR_FIELDS) {
    const message = parsed[key];
    if (isNonEmptyString(message)) return message.trim();
  }
  return null;
}

export function getAuthErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof InvalidAuthResponseError
      ? MESSAGES.invalidAuthResponse
      : MESSAGES.unexpectedError;
  }
  if (!error.response) return MESSAGES.cannotReachServer;
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