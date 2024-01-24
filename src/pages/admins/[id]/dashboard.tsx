import type { NextPage } from "next";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthAdminCheck from "@/components/AuthAdminCheck";

const UserProfile: NextPage = () => {

  const { isAuthAdmin } = useContext(AuthContext);

  return (
    <>
      <AuthAdminCheck>
        {isAuthAdmin && (
          <>
            <h1>管理dashboard</h1>
          </>
        )}
      </AuthAdminCheck>
    </>
  );
}

export default UserProfile;
