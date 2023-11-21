import axios from "@/lib/axios";
import { useState, createContext, ReactNode, FC, useEffect, useLayoutEffect } from "react";

export type User = {
  id?: number,
  name: string,
  email: string
}

export type InitialAuthContextVal = {
  isAuth: boolean,
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>
}

const initialAuthContextVal = {
  isAuth: false,
  setIsAuth: () => { },
  user: { id: undefined, name: '', email: '' },
  setUser: () => { },
}

const AuthContext = createContext<InitialAuthContextVal>(initialAuthContextVal);

type AuthContextProvidorProps = {
  children: ReactNode
}

const AuthContextProvidor: React.FC<AuthContextProvidorProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const [user, setUser] = useState<User>({ id: undefined, name: '', email: '' });

  useLayoutEffect(() => {
    const checkAuth = async () => {
      await axios.get('/api/user').then(res => {
        const user: User = res.data;

        setUser(user);

        setIsAuth(true);
      }).catch(e => {
        if (e.response.status == 401) {
          setIsAuth(false);

          setUser({ id: undefined, name: '', email: '' });
          
          return;
        }

        throw e;
      })
    }

    checkAuth();
  }, []);

  const providorVal = {
    isAuth,
    setIsAuth,
    user,
    setUser,
  }

  return (
    <AuthContext.Provider value={providorVal}>
      {children}
    </AuthContext.Provider>
  );
}

export {
  AuthContext,
  AuthContextProvidor
}
