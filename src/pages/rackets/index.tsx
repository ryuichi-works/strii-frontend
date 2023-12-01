import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

import AuthCheck from "@/components/AuthCheck";

const RacketList = () => {
  const { isAuth, user, setUser, setIsAuth } = useContext(AuthContext);

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <h1>ラケット一覧ページ</h1>

        )}
      </AuthCheck>
    </>
  );
}

export default RacketList;
