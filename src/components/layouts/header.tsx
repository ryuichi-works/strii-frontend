import axios from "@/lib/axios";
import Cookies from "js-cookie";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();

  const [hamburgerToggle, setHamburgerToggle] = useState<string>('close');

  const [rightPosition, setRightPositon] = useState<string>('right-[-150%]');

  const {
    user,
    setUser,
    setIsAuth,
    admin,
    setAdmin,
    setIsAuthAdmin,
  } = useContext(AuthContext);

  const hamburgerClickHandler = () => {
    if (hamburgerToggle === 'close') {
      setRightPositon('right-0');

      setHamburgerToggle('open');
    } else if ((hamburgerToggle === 'open')) {
      setRightPositon('right-[-150%]');

      setHamburgerToggle('close');
    }
  }

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const logout = async (
    e: React.FormEvent<HTMLFormElement>,
    authType: 'users' | 'admins',
  ) => {
    e.preventDefault();

    await csrf();

    await axios.post(`/${authType}/logout`, {}, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      },
    }).then((res) => {
      if (authType === 'users') {
        setUser({ id: undefined, name: '', email: '', file_path: '' });
        setIsAuth(false);
      } else if (authType === 'admins') {
        setAdmin({ id: undefined, name: '', email: '' });
        setIsAuthAdmin(false);
      }

      router.push(`/${authType}/login`);
    }).catch(error => {
      console.log('ログアウトに失敗しました。', error);
    })
  }

  return (
    <>
      <header className="relative text-[16px] bg-main-green mb-10">
        <div className="container mx-auto flex flex-row justify-center md:justify-between items-center bg-main-green h-[64px]">

          <div>
            <Link href='/'>
              <h1 className="text-faint-green text-2xl font-bold italic tracking-wide">STRii</h1>
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className="flex text-white ">

              <li><Link href="/" className="mr-4">HOME</Link></li>

              {(!user.id && !admin.id) && (
                <>
                  <li><Link href="/users/login" className="mr-4">ログイン</Link></li>
                  <li><Link href="/users/register">会員登録</Link></li>
                </>
              )}

              {user.id && (
                <>
                  <li><Link href={'/reviews'} className="mr-4">レビュー</Link></li>
                  <li><Link href={'/my_equipments'} className="mr-4">マイ装備</Link></li>
                  <li><Link href={'/guts'} className="mr-4">ストリング</Link></li>
                  <li><Link href={'/rackets'} className="mr-4">ラケット</Link></li>
                  <li><Link href={`/users/${user.id}/profile`} className="mr-4">マイページ</Link></li>

                  <li>
                    <form onSubmit={(e) => logout(e, 'users')} className="inline-block">
                      <button type='submit' className="inline-block">ログアウト</button>
                    </form>
                  </li>
                </>
              )}

              {admin.id && (
                <>
                  <li><Link href={`admins/${admin.id}/dashboard`} className="mr-4">dashboard</Link></li>

                  <li>
                    <form onSubmit={(e) => logout(e, 'admins')} className="inline-block">
                      <button type='submit' className="inline-block">ログアウト</button>
                    </form>
                  </li>
                </>
              )}

            </ul>
          </nav>

        </div>

        <div className="md:hidden absolute bottom-[50%] translate-y-2/4 right-4">
          <div onClick={hamburgerClickHandler} className="p-2">

            <span className="block w-6 h-1 bg-accent-green rounded mb-1"></span>

            <span className="block w-6 h-1 bg-accent-green rounded mb-1"></span>

            <span className="block w-6 h-1 bg-accent-green rounded"></span>

          </div>
        </div>

        <div onClick={hamburgerClickHandler} className={`md:hidden absolute ${rightPosition} w-screen z-50 duration-500 bg-faint-green bg-opacity-50 h-screen`}>
          <nav className=" bg-sub-green w-full">
            <ul className="flex flex-col text-white ">

              <li><Link href="/" className="inline-block text-center h-12 leading-[48px] border-b-2 border-b-afaint-green w-full" >HOME</Link></li>

              {(!user.id && !admin.id) && (
                <>
                  <li><Link href="/users/login" className="inline-block text-center h-12 leading-[48px] border-b-2 border-b-afaint-green w-full">ログイン</Link></li>

                  <li><Link href="/users/register" className="inline-block text-center h-12 leading-[48px] border-b-2 border-b-afaint-green w-full">会員登録</Link></li>
                </>
              )}

              {user.id && (
                <>
                  <li><Link href={'/reviews'} className="inline-block text-center h-12 leading-[48px] border-b-2 border-b-afaint-green  w-full">レビュー</Link></li>
                  <li><Link href={'/my_equipments'} className="inline-block text-center h-12 leading-[48px] border-b-2 border-b-afaint-green  w-full">マイ装備</Link></li>
                  <li><Link href={'/guts'} className="inline-block text-center h-12 leading-[48px] border-b-2 border-b-afaint-green  w-full">ストリング</Link></li>
                  <li><Link href={'/rackets'} className="inline-block text-center h-12 leading-[48px] border-b-2 border-b-afaint-green  w-full">ラケット</Link></li>
                  <li><Link href={`/users/${user.id}/profile`} className="inline-block text-center h-12 leading-[48px] border-b-2 border-b-afaint-green  w-full">マイページ</Link></li>

                  <li>
                    <form onSubmit={(e) => logout(e, 'users')} className="inline-block w-full">
                      <button type='submit' className="inline-block text-center h-12 leading-[48px]  w-full">ログアウト</button>
                    </form>
                  </li>
                </>
              )}

              {admin.id && (
                <>
                  <li><Link href={`admins/${admin.id}/dashboard`} className="inline-block text-center h-12 leading-[48px] border-b-2 border-b-afaint-green w-full">dashboard</Link></li>

                  <li>
                    <form onSubmit={(e) => logout(e, 'admins')} className="inline-block w-full">
                      <button type='submit' className="inline-block text-center h-12 leading-[48px]  w-full">ログアウト</button>
                    </form>
                  </li>
                </>
              )}

            </ul>
          </nav>
        </div>

      </header>
    </>
  );
}

export default Header;
