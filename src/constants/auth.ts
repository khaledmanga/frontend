export const AuthMode = {
  Login: "login",
  Register: "register",
} as const;
export type AuthMode = (typeof AuthMode)[keyof typeof AuthMode];

export const LOGIN_REQUEST = "auth/LOGIN_REQUEST" as const;
export const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS" as const;
export const LOGIN_FAILURE = "auth/LOGIN_FAILURE" as const;

export const REGISTER_REQUEST = "auth/REGISTER_REQUEST" as const;
export const REGISTER_SUCCESS = "auth/REGISTER_SUCCESS" as const;
export const REGISTER_FAILURE = "auth/REGISTER_FAILURE" as const;

export const SESSION_CHECK_REQUEST = "auth/SESSION_CHECK_REQUEST" as const;
export const SESSION_CHECK_SUCCESS = "auth/SESSION_CHECK_SUCCESS" as const;
export const SESSION_CHECK_FAILURE = "auth/SESSION_CHECK_FAILURE" as const;
export const SESSION_EXPIRED = "auth/SESSION_EXPIRED" as const;
export const LOGOUT_REQUEST = "auth/LOGOUT_REQUEST" as const;
export const LOGOUT_SUCCESS = "auth/LOGOUT_SUCCESS" as const;
export const LOGOUT_FAILURE = "auth/LOGOUT_FAILURE" as const;

export const AUTH_ACTION_TYPES = [
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  SESSION_CHECK_REQUEST,
  SESSION_CHECK_SUCCESS,
  SESSION_CHECK_FAILURE,
  SESSION_EXPIRED,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
] as const;

export type AuthActionType = (typeof AUTH_ACTION_TYPES)[number];
