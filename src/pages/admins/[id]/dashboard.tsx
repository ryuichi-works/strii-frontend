import type { NextPage } from "next";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthAdminCheck from "@/components/AuthAdminCheck";

const UserProfile: NextPage = () => {
  const router = useRouter();
  console.log(router.pathname);

  const { isAuthAdmin, setIsAuthAdmin, setAdmin } = useContext(AuthContext);

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const logout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await csrf();

    await axios.post('/admins/logout', {}, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      },
    }).then((res) => {
      setAdmin({ id: undefined, name: '', email: '' });

      setIsAuthAdmin(false);

      router.push('/admins/login');
    }).catch(error => {
      console.log('ログアウトに失敗しました。', error);
    })
  }

  return (
    <>
      <AuthAdminCheck>
        {isAuthAdmin && (
          <>
            <h1>管理dashboard</h1>
            <div className="flex flex-col text-center w-full mb-5">
              <h1 className="text-xl sm:text-2xl font-medium title-font text-gray-900">ログアウト</h1>
            </div>

            <form onSubmit={logout} className="w-full md:w-4/5 lg:max-w-md mx-auto border rounded-md py-2">
              <div className="px-2 py-4 w-full">
                <button type='submit' className="block mx-auto text-white w-3/4 sm:w-2/5 lg:w-2/5 bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-base">ログアウト</button>
              </div>
            </form>
            <h2>チルドレン</h2>
          </>
        )}
      </AuthAdminCheck>
    </>
  );
}

export default UserProfile;
