import { publicApi } from "api/axios";
import { AxiosResponse } from "axios";
import { AuthContext } from "contexts/AuthContext";
import { useContext } from "react";
import { AuthData } from "types";

export const useRefreshToken = () => {
  const { setAuth } = useContext(AuthContext);

  const refreshToken = async () => {
    // Get a new access token by hitting the `refresh` endpoint
    const response: AxiosResponse<AuthData> = await publicApi.get("refresh", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    const {
      id,
      username,
      isAdmin,
      accessToken: newAccessToken,
    } = response.data;

    // Update the auth context with the new access token and admin status
    setAuth((prev) => ({
      ...prev,
      id,
      username,
      isAdmin,
      accessToken: newAccessToken,
    }));

    return response.data.accessToken;
  };

  return refreshToken;
};
