"use client";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
type Content = {
  user: User | null;
  setUser: Dispatch<SetStateAction<null |User>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<null | string>>;
};
type User = {
  id: string;
  email: string;
  password: string;
  username: string;
  data: {
    createdAt: Date;
    email: string;
    password: string;
    name: string;
   id:string
  };
};

export const AuthContext = createContext<Content | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      setUser(JSON.parse(userItem));
    }
    const tokenItem = localStorage.getItem("token");
    if (tokenItem) {
      const decodedToken = jwtDecode<User>(tokenItem);
      setToken(tokenItem);
      setUser(decodedToken);
      console.log(decodedToken);
    }
  }, []);

  const values = {
    user,
    setUser,
    token,
    setToken,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
export const useUser = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("must use provider in order to use context");
  }
  return authContext;
};
