import React, { ReactNode, useContext, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

type AuthProps = {
  children: ReactNode
}

const AuthCheck: React.FC<AuthProps> = ({ children }) => {
  const router = useRouter();

  const { isAuth, isAuthAdmin } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuth && !isAuthAdmin) {
      router.push('/users/login');
    }
  }, [])


  return <div>{children}</div>;
}

export default AuthCheck;
