import AuthAdminCheck from "@/components/AuthAdminCheck";
import { AuthContext } from "@/context/AuthContext";
import type { NextPage } from "next";
import { useContext } from "react";

const GutRegister: NextPage = () => {
  const { admin, isAuthAdmin, } = useContext(AuthContext);

  return (
    <>
      <AuthAdminCheck>
        {isAuthAdmin && (
          <>
            <h1>ストリング登録ページ</h1>
          </>
        )}
      </AuthAdminCheck>

    </>
  );
}

export default GutRegister;
