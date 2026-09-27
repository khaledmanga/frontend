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

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type Credentials = { email: string; password: string };
export type RegistrationDetails = Credentials & { name: string };

export type AuthAction =
  | { type: typeof LOGIN_REQUEST; payload: Credentials }
  | { type: typeof LOGIN_SUCCESS; payload: AuthUser }
  | { type: typeof LOGIN_FAILURE; payload: string }
  | { type: typeof REGISTER_REQUEST; payload: RegistrationDetails }
  | { type: typeof REGISTER_SUCCESS; payload: AuthUser }
  | { type: typeof REGISTER_FAILURE; payload: string }
  | { type: typeof SESSION_CHECK_REQUEST }
  | { type: typeof SESSION_CHECK_SUCCESS; payload: AuthUser }
  | { type: typeof SESSION_CHECK_FAILURE; payload: string }
  | { type: typeof SESSION_EXPIRED }
  | { type: typeof LOGOUT_REQUEST }
  | { type: typeof LOGOUT_SUCCESS }
  | { type: typeof LOGOUT_FAILURE; payload: string };
