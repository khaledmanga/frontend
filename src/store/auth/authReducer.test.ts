import { describe, expect, it } from "vitest";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  registerFailure,
  registerRequest,
  registerSuccess,
  sessionCheckFailure,
  sessionCheckSuccess,
  sessionExpired,
} from "./authActions";
import { authReducer, initialAuthState } from "./authReducer";
import type { AuthUser } from "./authTypes";

const user: AuthUser = {
  id: "u1",
  email: "alex@example.com",
  name: "Alex",
};

describe("authReducer", () => {
  it.each([
    ["login", loginRequest("alex@example.com", "password")],
    ["registration", registerRequest("Alex", "alex@example.com", "password")],
  ])(
    "sets loading for a %s request and clears the previous error",
    (_name, action) => {
      const state = authReducer(
        { ...initialAuthState, error: "Previous error" },
        action,
      );
      expect(state).toEqual({
        ...initialAuthState,
        loading: true,
        error: null,
      });
      expect(state).not.toBe(initialAuthState);
    },
  );

  it.each([
    ["login", loginSuccess(user)],
    ["registration", registerSuccess(user)],
    ["session restoration", sessionCheckSuccess(user)],
  ])("stores the user after successful %s", (_name, action) => {
    expect(authReducer(initialAuthState, action)).toEqual({
      user,
      loading: false,
      error: null,
      initialized: true,
    });
  });

  it.each([
    ["login", loginFailure("Login failed")],
    ["registration", registerFailure("Registration failed")],
  ])(
    "clears loading and records a %s error without discarding the user",
    (_name, action) => {
      const loggedInState = {
        user,
        loading: true,
        error: null,
        initialized: true,
      };
      expect(authReducer(loggedInState, action)).toEqual({
        user,
        loading: false,
        error: action.payload,
        initialized: true,
      });
    },
  );

  it("clears the user after session verification fails or the session expires", () => {
    expect(
      authReducer(
        { user, loading: true, error: null, initialized: false },
        sessionCheckFailure("Session expired"),
      ),
    ).toEqual({
      user: null,
      loading: false,
      error: "Session expired",
      initialized: true,
    });
    expect(
      authReducer(
        { user, loading: false, error: null, initialized: true },
        sessionExpired(),
      ),
    ).toEqual(initialAuthStateWithExpiredSession);
  });

  it("returns the same state for an unrelated Redux action", () => {
    expect(authReducer(initialAuthState, { type: "unrelated" })).toBe(
      initialAuthState,
    );
  });
});

const initialAuthStateWithExpiredSession = {
  user: null,
  loading: false,
  error: null,
  initialized: true,
};
