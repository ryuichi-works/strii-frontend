import type { Racket } from "../users/[id]/profile";
import axios from "@/lib/axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";

import Link from "next/link";
import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import TextUnderBar from "@/components/TextUnderBar";

import { firstLetterToUpperCase } from "@/modules/firstLetterToUpperCase";

const RacketList = () => {
  const router = useRouter();

  const { isAuth, user } = useContext(AuthContext);

  const [rackets, setRackets] = useState<Racket[]>();

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/';

  useEffect(() => {
    if (user.id) {
      const getAllRackets = async () => {
        await axios.get('api/rackets').then(res => {
          setRackets(res.data);
        })
      }

      getAllRackets();
    } else {
      router.push('/users/login');
    }
  }, [])

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <div className="container mx-auto">
              <div className="text-center mb-6">
                <PrimaryHeading text="Rackets" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="flex justify-center mb-6 md:justify-end md:w-[100%] md:max-w-[768px] md:mx-auto">
                <button className="text-white text-[14px] w-[264px] h-8 rounded  bg-sub-green md:w-[80px] md:h-[32px]">検索</button>
              </div>

              {/* ラケットセクション */}
              <div>
                <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:flex-wrap md:justify-between">
                  {rackets?.map(racket => (
                    <Link href={`/rackets/${racket.id}`} key={racket.id} className="block hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                      <div className="flex  mb-6 hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                        <div className="w-[120px] mr-6">
                          {racket.racket_image.file_path
                            ? <img src={`${baseImagePath}${racket.racket_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[160px]" />
                            : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[160px]" />
                          }
                        </div>

                        <div className="w-[100%] max-w-[176px] pt-4 md:max-w-[216px]">
                          <p className="text-[14px] mb-2 pl-2 md:text-[16px]">{firstLetterToUpperCase(racket.maker.name_en)}</p>
                          <p className="text-[16px] text-center mb-2 md:text-[18px]">{racket.name_ja}</p>
                          <TextUnderBar className="w-[100%] max-w-[176px] md:max-w-[216px]" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default RacketList;
