import { ReactNode, createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken, removeToken] = useLocalStorage("authToken");

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };
