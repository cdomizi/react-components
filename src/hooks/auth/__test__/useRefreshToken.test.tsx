import { renderHook, waitFor } from "@testing-library/react";
import { publicApi } from "api/axios";
import { AxiosError } from "axios";
import { AuthProvider } from "contexts/AuthContext";
import { useRefreshToken } from "../useRefreshToken";

describe("useRefreshToken", () => {
  test("calls refresh endpoint and updates auth context with new access token", async () => {
    const mockTokenResponse = {
      data: {
        accessToken: "newAccessToken",
      },
    };
    const apiSpy = vi.spyOn(publicApi, "get");

    const { result } = renderHook(() => useRefreshToken(), {
      wrapper: AuthProvider,
    });

    const refreshToken = result.current;

    await waitFor(async () => {
      const newAccessToken = await refreshToken();

      expect(newAccessToken).toMatchObject(mockTokenResponse.data.accessToken);
    });

    expect(apiSpy).toHaveBeenCalledWith("refresh", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  });

  test("gets 403 Forbidden error on expired accessToken", async () => {
    const mockAxiosError = new AxiosError(
      "Forbidden: Authorization token not valid or expired",
      "403",
    );
    const apiSpy = vi
      .spyOn(publicApi, "get")
      .mockImplementationOnce(() => Promise.reject(mockAxiosError));

    const { result } = renderHook(() => useRefreshToken(), {
      wrapper: AuthProvider,
    });

    const refreshToken = result.current;

    await expect(refreshToken()).rejects.toThrowError(mockAxiosError);

    expect(apiSpy).toHaveBeenCalledWith("refresh", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  });
});
