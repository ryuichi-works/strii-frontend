import type { Racket } from "@/pages/users/[id]/profile";
import axios from "@/lib/axios";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

import Link from "next/link";
import PrimaryHeading from "@/components/PrimaryHeading";
import TextUnderBar from "@/components/TextUnderBar";
import AuthCheck from "@/components/AuthCheck";

import { firstLetterToUpperCase } from "@/modules/firstLetterToUpperCase";

const RacketShow = () => {
  const router = useRouter();

  const [id, setId] = useState(router.query.id);

  const { isAuth, user, isAuthAdmin } = useContext(AuthContext);

  const [racket, setRacket] = useState<Racket>();

  const [otherRackets, setOtherRackets] = useState<Racket[]>();

  const otherRacketsCount = 5;

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/';

  useEffect(() => {
    const getRacket = async () => {
      await axios.get(`api/rackets/${id}`).then(res => {
        setRacket(res.data);
      })
    }

    const getOtherGuts = async () => {
      await axios.get(`api/rackets/${id}/others`, {
        params: { count: otherRacketsCount }
      }).then(res => {
        setOtherRackets(res.data);
      })
    }

    getRacket();
    getOtherGuts();
  }, [id])

  return (
    <>
      <AuthCheck>
        {(isAuth || isAuthAdmin) && (
          <div className="container mx-auto">
            <div className="text-center mb-6 md:mb-[48px]">
              <PrimaryHeading text="Rackets" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
            </div>

            {/* ラケットセクション */}
            <div className="w-[100%] max-w-[320px] mx-auto mb-8 md:max-w-[400px] md:mb-[64px]">
              <div className="flex md:w-[100%] md:max-w-[400px]">
                <div className="w-[120px] mr-6 md:w-[160px] md:mr-8">
                  {racket?.racket_image.file_path
                    ? <img src={`${baseImagePath}${racket.racket_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[160px] md:w-[160px] md:h-[200px]" />
                    : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[160px] md:w-[160px] md:h-[200px]" />
                  }
                </div>

                <div className="w-[100%] max-w-[176px] pt-4 md:max-w-[208px]">
                  <p className="text-[14px] mb-2 pl-2 md:text-[16px]">{racket && firstLetterToUpperCase(racket.maker.name_en)}</p>
                  <p className="text-[16px] text-center mb-2 md:text-[18px]">{racket?.name_ja}</p>
                  <TextUnderBar className="w-[100%] max-w-[176px] md:max-w-[208px]" />
                </div>
              </div>
            </div>

            {/* ラケット情報セクション */}
            <div className="mb-[64px] md:mb-[128px]">
              <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">
                <table className="flex justify-center w-[100%] max-w-[320px] md:max-w-[768px] ">
                  <thead className="w-[100%] max-w-[160px] md:max-w-[384px]">
                    <tr className="flex flex-col text-left ">
                      <th className="font-normal text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px] md:pl-6">メーカー</th>
                      <th className="font-normal text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px] md:pl-6">ヘッドサイズ</th>
                      <th className="font-normal text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px] md:pl-6">重さ</th>
                      <th className="font-normal text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px] md:pl-6">長さ</th>
                      <th className="font-normal text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px] md:pl-6">バランス</th>
                      <th className="font-normal text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px] md:pl-6">ストリングパターン</th>
                      <th className="font-normal text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-y border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px] md:pl-6">フレーム厚</th>
                    </tr>
                  </thead>

                  <tbody className="w-[100%] max-w-[320px] md:max-w-[384px]">
                    <tr className="flex flex-col text-left">
                      <td className="text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px]">{racket?.maker.name_ja}</td>
                      <td className="text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px]">未登録</td>
                      <td className="text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px]">未登録</td>
                      <td className="text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px]">未登録</td>
                      <td className="text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px]">未登録</td>
                      <td className="text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px]">未登録</td>
                      <td className="text-[14px] h-[32px] leading-[32px] p-[0px] pl-1 border-y border-sub-green md:text-[16px] md:h-[50px] md:leading-[50px]">未登録</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {isAuthAdmin && (
                <div className="flex justify-center w-[100%] max-w-[320px] mx-auto mt-6 md:max-w-[720px] md:justify-end">
                  <Link href={`/rackets/${racket?.id}/edit`}>
                    <button type="button" className="text-white font-bold text-[14px] w-[200px] h-8 rounded  bg-sub-green">更新</button>
                  </Link>
                </div>
              )}
            </div>

            {/* otherラケットセクション */}
            <div className="">
              <p className="text-[14px] w-[100%] max-w-[320px] mx-auto mb-2 md:max-w-[768px] md:mb-[16px]">その他のラケット</p>
              <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:flex-wrap md:justify-between ">
                {/* ラケット */}
                {otherRackets && otherRackets.map(otherRacket => (
                  <Link href={`/rackets/${otherRacket.id}`} key={otherRacket.id} onClick={() => setId(`${otherRacket.id}`)} className="block hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                    <div className="flex  mb-6 hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                      <div className="w-[120px] mr-6">
                        {otherRacket.racket_image.file_path
                          ? <img src={`${baseImagePath}${otherRacket.racket_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[160px]" />
                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[160px]" />
                        }
                      </div>

                      <div className="w-[100%] max-w-[176px] pt-4 md:max-w-[216px]">
                        <p className="text-[14px] mb-2 pl-2 md:text-[16px]">{firstLetterToUpperCase(otherRacket.maker.name_en)}</p>
                        <p className="text-[16px] text-center mb-2 md:text-[18px]">{otherRacket.name_ja}</p>
                        <TextUnderBar className="w-[100%] max-w-[176px] md:max-w-[216px]" />
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

export default RacketShow;
