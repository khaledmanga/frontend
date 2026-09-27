import axios from "axios";

const apiBaseURL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api")
  : "/api";

export const apiHttp = axios.create({
  baseURL: apiBaseURL,
  headers: { "Content-Type": "application/json" },
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
        error.response?.status === 401 &&
        !["/auth/login", "/auth/register"].some((path) =>
          error.config?.url?.includes(path),
        )
      ) {
        onUnauthorized();
      }
      return Promise.reject(error);
    },
  );
}
