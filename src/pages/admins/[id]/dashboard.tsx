import type { NextPage } from "next";
import Head from 'next/head';
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
            <Head>
              <title>管理者 - dashboard</title>
            </Head>

            <h1>管理dashboard</h1>
          </>
        )}
      </AuthAdminCheck>
    </>
  );
}

export default UserProfile;
