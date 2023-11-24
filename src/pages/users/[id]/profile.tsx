import type { NextPage } from "next";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import Link from "next/link";

const UserProfile: NextPage = () => {

  const { isAuth, user } = useContext(AuthContext);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            {/* <h1>プロフィールページ</h1> */}
            <div className="container mx-auto">
              <div className="w-80 md:w-[704px] mx-auto flex flex-col md:flex-row md:justify-center">
                <div className="w-[320px] md:mr-[32px]">
                  <h2 className="text-xl">基本プロフィール</h2>
                  <hr className=" border-sub-green mb-6" />

                  <div className="w-16 mx-auto mb-4">
                    {user.file_path
                      ? <img src={`${baseImagePath}${user.file_path}`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                      : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full" />
                    }
                    <div className="w-8 h-1 bg-sub-green mx-auto"></div>
                  </div>

                  <hr />
                  <p className=" py-1">ユーザー名：{user.name}</p>

                  <hr />
                  <p className=" py-1 mb-4">メールアドレス：{user.email}</p>

                  <div className=" flex justify-end mb-14">
                    <Link href={`/users/${user.id}/edit/base_profile`}>
                      <button className="text-white text-[14px] w-[160px] h-8 rounded  bg-sub-green">基本プロフィール変更</button>
                    </Link>
                  </div>
                </div>

                <div className="w-[320px] md:ml-[32px]">
                  <h2 className="text-xl">テニスプロフィール</h2>
                  <hr className=" border-sub-green mb-4" />

                  <div className="flex flex-wrap justify-between mb-8">
                    <p className="mb-2 basis-full">使用ラケット</p>
                    <div className="w-28 h-40 bg-faint-green">
                      <img src={`${baseImagePath}images/rackets/defalt_racket_image.jpg`} width="112px" alt="ラケット画像" />
                    </div>
                    <div className="w-44 flex flex-col">
                      <span className="inline-block pl-2 text-xs mb-2">Babolat</span>
                      <p className="pl-2 leading-[18px] mb-4">ピュアアエロ</p>
                      <hr className="border-sub-green" />
                    </div>
                  </div>

                  <hr />
                  <p className="py-1">テニス歴：</p>

                  <hr />
                  <p className="py-1">テニス頻度：</p>

                  <hr />
                  <p className="py-1">プレースタイル：</p>

                  <hr />
                  <p className="py-1">グリップ：</p>

                  <hr />
                  <p className="py-1">好きなショット：</p>

                  <hr />
                  <p className="py-1">苦手なショット：</p>

                  <hr />
                  <p className="py-1">年齢：</p>

                  <hr />
                  <p className="py-1">背丈：</p>

                  <hr />
                  <p className="py-1 mb-4">体格：</p>

                  <div className=" flex justify-end mb-14">
                    <Link href={`/users/${user.id}/edit/tennis_profile`}>
                      <button className="text-white text-[14px] w-[160px] h-8 rounded  bg-sub-green">テニスプロフィール変更</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default UserProfile;
