import React, { ReactNode, useContext, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

type AuthProps = {
  children: ReactNode
}

const AuthAdminCheck: React.FC<AuthProps> = ({ children }) => {
  const router = useRouter();

  const { isAuthAdmin } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthAdmin) {
      router.push('/admins/login');
    }
  }, [])


  return <div>{children}</div>;
}

export default AuthAdminCheck;
