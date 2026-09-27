import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { getAuthErrorMessage, normalizeAuthUser } from "./authApi";

function createResponseError(status: number, data: unknown) {
  return new AxiosError(
    "Request failed",
    undefined,
    undefined,
    undefined,
    {
      data,
      status,
      statusText: "",
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    },
  );
}

describe("getAuthErrorMessage", () => {
  it("shows the server error returned in an error field", () => {
    expect(
      getAuthErrorMessage(createResponseError(404, { error: "user not found" })),
    ).toBe("user not found");
  });

  it("shows a message returned as a JSON string", () => {
    expect(
      getAuthErrorMessage(
        createResponseError(404, '{"error":"user not found"}'),
      ),
    ).toBe("user not found");
  });

  it("uses the existing status message when the server has no message", () => {
    expect(getAuthErrorMessage(createResponseError(401, {}))).toBe(
      "Your email or password is incorrect.",
    );
  });
});

describe("normalizeAuthUser", () => {
  it("normalizes the server's session-cookie response without a token", () => {
    expect(
      normalizeAuthUser(
        { id: 42, email: "alex@server.example", username: "Alex Server" },
        { email: "alex@example.com" },
      ),
    ).toEqual({
      id: "42",
      email: "alex@server.example",
      name: "Alex Server",
    });
  });

  it("uses user details returned by the server when available", () => {
    expect(
      normalizeAuthUser(
        {
          user: {
            id: 42,
            email: "alex@server.example",
            username: "Alex Server",
          },
        },
        { email: "alex@example.com" },
      ),
    ).toEqual({
      id: "42",
      email: "alex@server.example",
      name: "Alex Server",
    });
  });

  it("rejects a successful response without a server identity", () => {
    expect(() =>
      normalizeAuthUser(
        { message: "Login successful" },
        { email: "alex@example.com" },
      ),
    ).toThrow("The authentication service returned an invalid response.");
  });
});
