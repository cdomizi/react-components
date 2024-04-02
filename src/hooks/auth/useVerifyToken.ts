import { AuthContext } from "contexts/AuthContext";
import { useRefreshToken } from "hooks/auth/useRefreshToken";
import { useContext, useEffect, useState } from "react";

type useVerifyTokenProps = {
  redirect: () => void;
  setLoading?: (isLoading?: boolean) => void;
  retry?: boolean;
  setRetry?: (retry?: boolean) => void;
};

export const useVerifyToken = ({
  redirect,
  setLoading,
  retry = false,
  setRetry,
}: useVerifyTokenProps) => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const refreshToken = useRefreshToken();
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    // Initialize variable for cleanup
    let ignore = false;

    const verifyToken = async () => {
      try {
        // Sets a new access token if expired
        // as long as the refresh token is valid
        const newAccessToken = await refreshToken();
        newAccessToken && setIsTokenValid(true);
      } catch (err) {
        // On refresh token expired, clean auth context
        setAuth(null);

        setIsTokenValid(false);

        // Redirect user to login
        redirect && redirect();
      } finally {
        !ignore && setLoading && setLoading(false);
      }
    };

    // Only verify the token if there is no access token in auth context
    if (!auth?.accessToken && !retry) {
      void verifyToken();
    } else {
      setLoading && setLoading(false);
    }

    return function cleanUp() {
      ignore = true;
      setRetry && setRetry(true);
    };
  }, [
    auth?.accessToken,
    isTokenValid,
    redirect,
    refreshToken,
    retry,
    setAuth,
    setLoading,
    setRetry,
  ]);

  return isTokenValid;
};
