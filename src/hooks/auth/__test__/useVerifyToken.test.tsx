import { renderHook, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import { AuthContext, AuthProvider } from "contexts/AuthContext";
import { PropsWithChildren } from "react";
import { AuthData } from "types";
import * as useRefreshToken from "../useRefreshToken";
import { useVerifyToken } from "../useVerifyToken";

describe("useVerifyToken", () => {
  test("returns false if token not provided & redirects the user", async () => {
    let auth = {} as AuthData | null;
    const setAuth = vi.fn(() => {
      auth = null;
    });

    const MockAuthProvider = ({ children }: PropsWithChildren) => {
      return (
        <AuthContext.Provider value={{ auth, setAuth }}>
          {children}
        </AuthContext.Provider>
      );
    };

    const mockRefreshToken = vi.fn(() =>
      Promise.reject(
        new AxiosError(
          "Forbidden: Authorization token not valid or expired",
          "403",
        ),
      ),
    );
    // Mock error response
    vi.spyOn(useRefreshToken, "useRefreshToken").mockImplementationOnce(
      () => mockRefreshToken,
    );
    const redirect = vi.fn();
    const setLoading = vi.fn();

    const { result } = renderHook(
      () =>
        useVerifyToken({
          redirect,
          setLoading,
        }),
      {
        wrapper: MockAuthProvider,
      },
    );

    expect(auth).not.toBeNull();
    expect(redirect).not.toHaveBeenCalled();
    expect(setLoading).not.toHaveBeenCalled();
    expect(setAuth).not.toHaveBeenCalled();
    // No access token in the auth context
    expect(auth?.accessToken).toBeUndefined();

    await waitFor(() => {
      const isTokenValid = result.current;

      expect(isTokenValid).toBe(false);
    });

    // User redirected
    expect(redirect).toHaveBeenCalledOnce();
    // Loading set to false
    expect(setLoading).toHaveBeenCalledOnce();
    expect(setLoading).toHaveBeenCalledWith(false);
    // Auth set to null
    expect(setAuth).toHaveBeenCalledOnce();
    expect(setAuth).toHaveBeenCalledWith(null);
    expect(auth).toBeNull();
  });

  test("returns true if provided token is valid", async () => {
    const redirect = vi.fn();

    const { result } = renderHook(
      () =>
        useVerifyToken({
          redirect,
        }),
      {
        wrapper: AuthProvider,
      },
    );

    await waitFor(() => {
      const isTokenValid = result.current;

      expect(isTokenValid).toBe(true);
    });
  });

  test("verification process not triggered if access token is not present", async () => {
    const mockAuthData: AuthData = {
      id: 1,
      username: "johnDoe",
      isAdmin: false,
      accessToken: "testAccessToken", // accessToken is set
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

    const mockRefreshToken = vi.fn();
    vi.spyOn(useRefreshToken, "useRefreshToken").mockImplementationOnce(
      () => mockRefreshToken,
    );

    const redirect = vi.fn();
    const setLoading = vi.fn();
    const retry = false;
    const setRetry = vi.fn();

    const { result } = renderHook(
      () =>
        useVerifyToken({
          redirect,
          setLoading,
          retry,
          setRetry,
        }),
      {
        wrapper: MockAuthProvider,
      },
    );

    await waitFor(() => {
      const isTokenValid = result.current;

      expect(isTokenValid).toBe(false);
    });

    // Token verification not triggered since access token is present
    expect(mockRefreshToken).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledOnce();
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  test("verification process not triggered on retry set to true", async () => {
    const auth = {} as AuthData | null;
    const setAuth = vi.fn();

    const MockAuthProvider = ({ children }: PropsWithChildren) => {
      return (
        <AuthContext.Provider value={{ auth, setAuth }}>
          {children}
        </AuthContext.Provider>
      );
    };

    const mockRefreshToken = vi.fn();
    vi.spyOn(useRefreshToken, "useRefreshToken").mockImplementationOnce(
      () => mockRefreshToken,
    );

    const redirect = vi.fn();
    const setLoading = vi.fn();
    const retry = true; // retry set to true
    const setRetry = vi.fn();

    const { result } = renderHook(
      () =>
        useVerifyToken({
          redirect,
          setLoading,
          retry,
          setRetry,
        }),
      {
        wrapper: MockAuthProvider,
      },
    );

    await waitFor(() => {
      const isTokenValid = result.current;

      expect(isTokenValid).toBe(false);
    });

    // Token verification not triggered on retry set to true
    expect(mockRefreshToken).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledOnce();
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});
