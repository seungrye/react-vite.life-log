import { useEffect, useState } from "react";
import { AuthContext } from "../types/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    const savedAuth = sessionStorage.getItem('authenticated');
    return savedAuth ? JSON.parse(savedAuth) : false;
  });

  const setAuth = (value: boolean) => {
    setAuthenticated(value);
    sessionStorage.setItem('authenticated', JSON.stringify(value));
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('authenticated');
    if (savedAuth) {
      setAuthenticated(JSON.parse(savedAuth));
    }
  }, []);


  return <AuthContext.Provider value={{ authenticated, setAuth }}>
    {children}
  </AuthContext.Provider>
}

