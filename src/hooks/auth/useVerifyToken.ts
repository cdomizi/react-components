import { AuthContext } from "contexts/AuthContext";
import { useRefreshToken } from "hooks/auth/useRefreshToken";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type useVerifyTokenProps = {
  redirect: () => void;
  setLoading: ((isLoading: boolean) => void) | null;
  retry: boolean | null;
  setRetry: ((retry: boolean) => void) | null;
};

const useVerifyToken = ({
  redirect,
  setLoading,
  retry = false,
  setRetry = null,
}: useVerifyTokenProps) => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const refreshToken = useRefreshToken();
  const { auth, setAuth } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize variable for cleanup
    let ignore = false;

    const verifyToken = async () => {
      try {
        // Sets a new access token if expired
        // as long as the refreshToken is valid
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
    if (!auth?.accessToken && (!retry ?? true)) {
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
    location,
    navigate,
    redirect,
    refreshToken,
    retry,
    setAuth,
    setLoading,
    setRetry,
  ]);

  return isTokenValid;
};

export default useVerifyToken;
