import { type Epic, ofType } from "redux-observable";
import axios from "axios";
import { from, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import {
  getAuthErrorMessage,
  getCurrentUser,
  loginApi,
  logoutApi,
  registerApi,
} from "@/apis/auth.api";
import type { RootState } from "@/reducer/rootReducer";
import {
  loginFailure,
  loginSuccess,
  logoutFailure,
  logoutSuccess,
  registerFailure,
  registerSuccess,
  sessionCheckFailure,
  sessionCheckSuccess,
} from "@/reducer/authActions";
import {
  type   AuthAction,
} from "@/@types/auth";
import {
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  REGISTER_REQUEST,
  SESSION_CHECK_REQUEST,
} from "@/constants/auth";
import { HttpStatus } from "@/constants/httpStatus";
import { MESSAGES } from "@/constants/messages";

export type AuthEpic = Epic<AuthAction, AuthAction, RootState>;

export const loginEpic: AuthEpic = (action$) =>
  action$.pipe(
    ofType(LOGIN_REQUEST),
    switchMap((action) => {
      if (!action.payload.email.trim() || !action.payload.password) {
        return of(loginFailure(MESSAGES.loginFieldsRequired));
      }
      return from(loginApi(action.payload)).pipe(
        map(loginSuccess),
        catchError((error: unknown) =>
          of(loginFailure(getAuthErrorMessage(error))),
        ),
      );
    }),
  );

export const registerEpic: AuthEpic = (action$) =>
  action$.pipe(
    ofType(REGISTER_REQUEST),
    switchMap((action) => {
      if (
        !action.payload.name.trim() ||
        !action.payload.email.trim() ||
        !action.payload.password
      ) {
        return of(registerFailure(MESSAGES.registrationFieldsRequired));
      }
      return from(registerApi(action.payload)).pipe(
        map(registerSuccess),
        catchError((error: unknown) =>
          of(registerFailure(getAuthErrorMessage(error))),
        ),
      );
    }),
  );

export const sessionCheckEpic: AuthEpic = (action$) =>
  action$.pipe(
    ofType(SESSION_CHECK_REQUEST),
    switchMap(() =>
      from(getCurrentUser()).pipe(
        map(sessionCheckSuccess),
        catchError((error: unknown) => {
          const message =
            axios.isAxiosError(error) &&
            error.response?.status === HttpStatus.Unauthorized
              ? ""
              : getAuthErrorMessage(error);
          return of(sessionCheckFailure(message));
        }),
      ),
    ),
  );

export const logoutEpic: AuthEpic = (action$) =>
  action$.pipe(
    ofType(LOGOUT_REQUEST),
    switchMap(() =>
      from(logoutApi()).pipe(
        map(logoutSuccess),
        catchError((error: unknown) =>
          of(logoutFailure(getAuthErrorMessage(error))),
        ),
      ),
    ),
  );
