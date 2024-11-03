import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { User } from "firebase/auth";
import { AuthContext } from "../types/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuth] = useState<boolean | null>(!!auth.currentUser);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, [authenticated]);

  return <AuthContext.Provider value={{ authenticated, setAuth, user }}>
    {children}
  </AuthContext.Provider>
}

