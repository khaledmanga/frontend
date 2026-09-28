import axios from "axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { apiBaseURL } from "@/constants/env";
import { HTTP_HEADERS, HTTP_MEDIA_TYPES } from "@/constants/httpHeaders";
import { HttpStatus } from "@/constants/httpStatus";

export const apiHttp = axios.create({
  baseURL: apiBaseURL,
  headers: { [HTTP_HEADERS.ContentType]: HTTP_MEDIA_TYPES.Json },
  withCredentials: true,
});

let unauthorizedHandlerInstalled = false;

export function installUnauthorizedHandler(onUnauthorized: () => void): void {
  if (unauthorizedHandlerInstalled) return;
  unauthorizedHandlerInstalled = true;
  apiHttp.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === HttpStatus.Unauthorized &&
        ![API_ENDPOINTS.AUTH_LOGIN, API_ENDPOINTS.AUTH_REGISTER].some((path) =>
          error.config?.url?.includes(path),
        )
      ) {
        onUnauthorized();
      }
      return Promise.reject(error);
    },
  );
}
