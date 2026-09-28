import type {
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
