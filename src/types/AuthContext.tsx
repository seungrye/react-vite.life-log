import { createContext } from "react";
import { User } from "firebase/auth";

type AuthContextType = {
  authenticated: boolean | null,
  setAuth: (value: boolean) => void,
  user: User | null
};

export const AuthContext = createContext<AuthContextType>({
  authenticated: null,
  setAuth: () => { },
  user: null
});

