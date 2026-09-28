import type { AuthUser, Credentials, RegistrationDetails } from "@/@types/auth";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  SESSION_CHECK_FAILURE,
  SESSION_CHECK_REQUEST,
  SESSION_CHECK_SUCCESS,
  SESSION_EXPIRED,
} from "@/constants/auth";

export const loginRequest = (email: string, password: string) =>
  ({
    type: LOGIN_REQUEST,
    payload: { email, password },
  }) as const;
export const loginSuccess = (user: AuthUser) =>
  ({ type: LOGIN_SUCCESS, payload: user }) as const;
export const loginFailure = (error: string) =>
  ({ type: LOGIN_FAILURE, payload: error }) as const;

export const registerRequest = (
  name: string,
  email: string,
  password: string,
) =>
  ({
    type: REGISTER_REQUEST,
    payload: { name, email, password },
  }) as const;
export const registerSuccess = (user: AuthUser) =>
  ({ type: REGISTER_SUCCESS, payload: user }) as const;
export const registerFailure = (error: string) =>
  ({ type: REGISTER_FAILURE, payload: error }) as const;

export const sessionCheckRequest = () =>
  ({ type: SESSION_CHECK_REQUEST }) as const;
export const sessionCheckSuccess = (user: AuthUser) =>
  ({ type: SESSION_CHECK_SUCCESS, payload: user }) as const;
export const sessionCheckFailure = (error: string) =>
  ({ type: SESSION_CHECK_FAILURE, payload: error }) as const;
export const sessionExpired = () => ({ type: SESSION_EXPIRED }) as const;
export const logoutRequest = () => ({ type: LOGOUT_REQUEST }) as const;
export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS }) as const;
export const logoutFailure = (error: string) =>
  ({ type: LOGOUT_FAILURE, payload: error }) as const;

export type LoginRequestAction = ReturnType<typeof loginRequest> & {
  payload: Credentials;
};
export type RegisterRequestAction = ReturnType<typeof registerRequest> & {
  payload: RegistrationDetails;
};
