import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { useState, createContext, ReactNode, FC, useEffect, useLayoutEffect } from "react";

export type User = {
  id?: number,
  name: string,
  email: string,
  file_path: string
}

export type Admin = {
  id?: number,
  name: string,
  email: string,
}

export type InitialAuthContextVal = {
  isAuth: boolean,
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  isAuthAdmin: boolean,
  setIsAuthAdmin: React.Dispatch<React.SetStateAction<boolean>>,
  admin: Admin,
  setAdmin: React.Dispatch<React.SetStateAction<Admin>>
}

const initialAuthContextVal = {
  isAuth: false,
  setIsAuth: () => { },
  user: { id: undefined, name: '', email: '', file_path: '' },
  setUser: () => { },
  isAuthAdmin: false,
  setIsAuthAdmin: () => { },
  admin: { id: undefined, name: '', email: ''},
  setAdmin: () => { },
}

const AuthContext = createContext<InitialAuthContextVal>(initialAuthContextVal);

type AuthContextProvidorProps = {
  children: ReactNode
}

const AuthContextProvidor: React.FC<AuthContextProvidorProps> = ({ children }) => {
  const router = useRouter();

  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isAuthAdmin, setIsAuthAdmin] = useState<boolean>(false);

  const [user, setUser] = useState<User>({ id: undefined, name: '', email: '', file_path: '' });
  const [admin, setAdmin] = useState<Admin>({ id: undefined, name: '', email: ''});

  //初期アクセスもしくはurl直接変更によるアクセス時のチェック
  const checkAuth = async (
    authType: 'user' | 'admin',
    setAuthFunc: React.Dispatch<React.SetStateAction<User>> | React.Dispatch<React.SetStateAction<Admin>>,
    setIsAuthFunc: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      const res = await axios.get(`/api/${authType}`);

      const userData: User = res.data;

      setAuthFunc(userData);
      setIsAuthFunc(true);
    } catch (e: any) {
      if (e.response.status == 401) {
        setIsAuthFunc(false);
        setAuthFunc({ id: undefined, name: '', email: '', file_path: '' });

        return;
      }

      throw e;
    }
  }

  useLayoutEffect(() => {
    if (router.pathname.startsWith('/users')) {
      checkAuth('user', setUser, setIsAuth);
    } else if (router.pathname.startsWith('/admins')) {
      checkAuth('admin', setAdmin, setIsAuthAdmin);
    }
  }, []);

  const providorVal = {
    user,
    setUser,
    isAuth,
    setIsAuth,

    admin,
    setAdmin,
    isAuthAdmin,
    setIsAuthAdmin,
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
