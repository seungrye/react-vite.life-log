import { createContext } from "react";

interface IAuthContextType {
  authenticated: boolean | null,
  setAuth: (value: boolean) => void,
};

export const AuthContext = createContext<IAuthContextType>({
  authenticated: null,
  setAuth: () => { },
});

