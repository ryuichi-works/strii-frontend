import type { Gut } from "../reviews";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/lib/axios";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

import AuthCheck from "@/components/AuthCheck";
import TextUnderBar from "@/components/TextUnderBar";
import PrimaryHeading from "@/components/PrimaryHeading";

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
          <div className="container mx-auto">
            <div className="text-center mb-6">
              <PrimaryHeading text="Strings" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
            </div>

            <div className="flex justify-center mb-6 md:justify-end md:w-[100%] md:max-w-[768px] md:mx-auto">
              <button className="text-white text-[14px] w-[264px] h-8 rounded  bg-sub-green md:w-[80px] md:h-[32px]">検索</button>
            </div>

            {/* ガットセクション */}
            <div className="">
              <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:flex-wrap md:justify-between ">
                {/* ガット */}
                {guts && guts.map(gut => (
                  <Link href={`/guts/${gut.id}`} key={gut.id} className="block hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                    <div className="flex  mb-6 hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                      <div className="w-[120px] mr-6">
                        {gut.gut_image.file_path
                          ? <img src={`${baseImagePath}${gut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                        }
                      </div>

                      <div className="w-[100%] max-w-[160px] md:max-w-[216px]">
                        <p className="text-[14px] mb-2 md:text-[16px]">{gut.maker.name_ja}</p>
                        <p className="text-[16px] mb-2 md:text-[18px]">{gut.name_ja}</p>
                        <TextUnderBar className="w-[100%] max-w-[160px] md:max-w-[216px]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </AuthCheck>
    </>
  );
}

export default GutList;
