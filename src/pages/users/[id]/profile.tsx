import type { NextPage } from "next";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";

const UserProfile: NextPage = () => {

  const { isAuth } = useContext(AuthContext);

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <h1>プロフィールページ</h1>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default UserProfile;
