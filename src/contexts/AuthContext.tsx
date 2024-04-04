import { PropsWithChildren, createContext, useState } from "react";
import { AuthData } from "types";

type AuthContextType = {
  auth: AuthData | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthData | null>>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<AuthData | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
