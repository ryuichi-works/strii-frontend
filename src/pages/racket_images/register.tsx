import AuthCheck from "@/components/AuthCheck";
import { AuthContext } from "@/context/AuthContext";
import { NextPage } from "next";
import { useContext } from "react";

const RacketImageRegister: NextPage = () => {
  const { isAuth, user } = useContext(AuthContext);
  return (
    <>
      <AuthCheck>
        {isAuth && (
          <h1>ラケット登録ページ</h1>
        )}
      </AuthCheck>
    </>
  );
}

export default RacketImageRegister;
