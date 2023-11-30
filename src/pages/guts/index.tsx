import type { Gut } from "../reviews";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/lib/axios";
import { AuthContext } from "@/context/AuthContext";

import AuthCheck from "@/components/AuthCheck";
import TextUnderBar from "@/components/TextUnderBar";

const GutList = () => {
  const router = useRouter();
  const { isAuth, user, setUser, setIsAuth } = useContext(AuthContext);

  const [guts, setGuts] = useState<Gut[]>();

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  useEffect(() => {
    if (user.id) {
      const getAllGuts = async () => {
        await axios.get('api/guts').then(res => {
          setGuts(res.data);
        })
      }

      getAllGuts();
    } else {
      router.push('/users/login');
    }
  }, [])

  return (
    <>
      <AuthCheck>
        {isAuth && (
          // <h1>ストリング一覧ページ</h1>
          <div className="container">
            <div className="text-center mb-6">
              <PrimaryHeading text="Strings" className="text-[18px] h-[20px]" />
            </div>

            <div className="flex justify-center mb-6">
              <button className="text-white text-[14px] w-[264px] h-8 rounded  bg-sub-green">検索</button>
            </div>

            {/* ガットセクション */}
            <div>
              <div className="w-[100%] max-w-[320px] mx-auto">
                {/* ガット */}
                {guts && guts.map(gut => (
                  <div key={gut.name_ja} className="flex  mb-6 hover:opacity-80 hover:cursor-pointer">
                    <div className="w-[120px] mr-6">
                      {gut.gut_image.file_path
                        ? <img src={`${baseImagePath}${gut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                        : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                      }
                    </div>

                    <div className="w-[100%] max-w-[160px]">
                      <p className="text-[14px] mb-2">{gut.maker.name_ja}</p>
                      <p className="text-[16px] mb-2">{gut.name_ja}</p>
                      <TextUnderBar className="w-[100%] max-w-[160px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        )}
      </AuthCheck>
    </>
  );
}

const PrimaryHeading: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
  return (
    <h1 className={`${className}`}>{text}</h1>
  );
}

export default GutList;
