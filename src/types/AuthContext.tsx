import { createContext } from "react";
import { User } from "firebase/auth";

interface IAuthContextType {
  authenticated: boolean | null,
  setAuth: (value: boolean) => void,
  user: User | null
};

export const AuthContext = createContext<IAuthContextType>({
  authenticated: null,
  setAuth: () => { },
  user: null
});

