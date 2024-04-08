import { renderHook, waitFor } from "@testing-library/react";
import { AuthContext, AuthProvider } from "contexts/AuthContext";
import { expectedForbiddenError, expectedToken } from "mocks/handlers";
import { PropsWithChildren } from "react";
import { AuthData } from "types";
import { CustomRequestConfig, useAuthApi } from "../useAuthApi";
import * as useRefreshToken from "../useRefreshToken";

describe("useAuthApi", () => {
  test("attaches interceptors to the authApi instance", async () => {
    const expectedAuthHeader = `Bearer ${expectedToken}`;

    const mockAuthData: AuthData = {
      id: 1,
      username: "johnDoe",
      isAdmin: false,
      accessToken: expectedToken, // accessToken is present
    };
    const auth: AuthData | null = mockAuthData;
    const setAuth = vi.fn();

    const MockAuthProvider = ({ children }: PropsWithChildren) => {
      return (
        <AuthContext.Provider value={{ auth, setAuth }}>
          {children}
        </AuthContext.Provider>
      );
    };

    const { result } = renderHook(() => useAuthApi(), {
      wrapper: MockAuthProvider,
    });

    const authApi = result.current;
    const response = await authApi.get("posts/1");

    // Response has authorization headers attached
    expect(response.config.headers.Authorization).toBe(expectedAuthHeader);
  });

  test("request interceptor sets Authorization header if not already present", async () => {
    const auth: AuthData | null = null; // accessToken is not present
    const setAuth = vi.fn();

    const MockAuthProvider = ({ children }: PropsWithChildren) => {
      return (
        <AuthContext.Provider value={{ auth, setAuth }}>
          {children}
        </AuthContext.Provider>
      );
    };

    const { result } = renderHook(() => useAuthApi(), {
      wrapper: MockAuthProvider,
    });

    const authApi = result.current;
    const response = await authApi.get("posts/1");

    // Response has no authorization headers attached
    expect(response.config.headers.Authorization).toBeUndefined();
  });

  test("response interceptor retries request on expired access token", async () => {
    // Mock error response on expired access token
    const mockRefreshToken = vi.fn();
    vi.spyOn(useRefreshToken, "useRefreshToken").mockImplementation(
      () => mockRefreshToken,
    );

    const { result } = renderHook(() => useAuthApi(), {
      wrapper: AuthProvider,
    });

    const authApi = result.current;

    await waitFor(() => {
      expect(async () => {
        // Mock endpoint responds with 403 error
        const response = await authApi.get("403-error");

        const errorConfig = response.config as CustomRequestConfig;

        // _retry flag set as true in request config
        expect(errorConfig._retry).toBe(true);
        // Request retried by getting a new auth token
        expect(mockRefreshToken).toHaveBeenCalledOnce();
      }).rejects.toThrow();
    });
  });

  test("response interceptor returns error on expired access token", () => {
    // Mock error response on expired access token
    const mockRefreshToken = vi.fn();
    vi.spyOn(useRefreshToken, "useRefreshToken").mockImplementation(
      () => mockRefreshToken,
    );

    const { result } = renderHook(() => useAuthApi(), {
      wrapper: AuthProvider,
    });

    const authApi = result.current;

    expect(async () => {
      await authApi.get("403-error");
    }).rejects.toThrow(expectedForbiddenError);
  });

  test("performs cleanup on every request", async () => {
    const expectedInterceptors = {
      handlers: [
        null,
        null,
        null,
        null,
        {
          synchronous: false,
          runWhen: null,
        },
      ],
    };

    const auth: AuthData | null = null;
    const setAuth = vi.fn();

    const MockAuthProvider = ({ children }: PropsWithChildren) => {
      return (
        <AuthContext.Provider value={{ auth, setAuth }}>
          {children}
        </AuthContext.Provider>
      );
    };

    const { result } = renderHook(() => useAuthApi(), {
      wrapper: MockAuthProvider,
    });

    const authApi = result.current;

    // Make a request
    await authApi.get("posts/1");

    // Request interceptors removed
    expect(JSON.stringify(authApi.interceptors.request)).toStrictEqual(
      JSON.stringify(expectedInterceptors),
    );
    // Response interceptors removed
    expect(JSON.stringify(authApi.interceptors.response)).toStrictEqual(
      JSON.stringify(expectedInterceptors),
    );
  });
});
