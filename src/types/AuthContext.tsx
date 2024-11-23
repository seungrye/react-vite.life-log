import { createContext } from "react";

interface IAuthContextType {
  authenticated: boolean,
  setAuth: (value: boolean) => void,
};

export const AuthContext = createContext<IAuthContextType>({
  authenticated: false,
  setAuth: () => { },
});

