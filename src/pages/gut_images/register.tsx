import AuthCheck from "@/components/AuthCheck";
import { AuthContext } from "@/context/AuthContext";
import { NextPage } from "next";
import { useContext } from "react";

const GutImageRegister: NextPage = () => {
  const { isAuth, user } = useContext(AuthContext);
  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <h1>ストリング画像登録</h1>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default GutImageRegister;
