import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { User } from "firebase/auth";

type AuthContextType = {
  authenticated: boolean | null,
  setAuth: (value: boolean) => void,
  user: User | null
};

const AuthContext = createContext<AuthContextType>({
  authenticated: null,
  setAuth: () => { },
  user: null
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuth] = useState<boolean | null>(!!auth.currentUser);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, [authenticated]);

  return <AuthContext.Provider value={{ authenticated, setAuth, user }}>
    {children}
  </AuthContext.Provider>
}

export default AuthProvider;
