import type { UnknownAction } from "redux";
import type { AuthAction, AuthUser } from "@/@types/auth";
import {
  AUTH_ACTION_TYPES,
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

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
};

export const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

function isAuthAction(action: UnknownAction): action is AuthAction {
  return AUTH_ACTION_TYPES.some((type) => type === action.type);
}

export function authReducer(
  state: AuthState = initialAuthState,
  action: UnknownAction,
): AuthState {
  if (!isAuthAction(action)) return state;
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case LOGOUT_REQUEST:
    case SESSION_CHECK_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case SESSION_CHECK_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        initialized: true,
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case SESSION_CHECK_FAILURE:
    case LOGOUT_FAILURE:
      return {
        ...state,
        user: action.type === SESSION_CHECK_FAILURE ? null : state.user,
        loading: false,
        error: action.payload,
        initialized:
          action.type === SESSION_CHECK_FAILURE ? true : state.initialized,
      };
    case SESSION_EXPIRED:
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        initialized: true,
      };
    default:
      return assertNever(action);
  }
}

function assertNever(action: never): never {
  return action;
}
