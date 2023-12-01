import type { Racket } from "@/pages/users/[id]/profile";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import TextUnderBar from "@/components/TextUnderBar";
import { firstLetterToUpperCase } from "@/modules/firstLetterToUpperCase";

const RacketShow = () => {
  const router = useRouter();

  const id = router.query.id;

  const { isAuth, user } = useContext(AuthContext);

  const [racket, setRacket] = useState<Racket>();
  console.log(racket);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/';

  useEffect(() => {
    if (user.id) {
      const getRacket = async () => {
        // await axios.get('api/rackets').then(res => {
        await axios.get(`api/rackets/${id}`).then(res => {
          setRacket(res.data);
        })
      }

      getRacket();
    } else {
      router.push('/users/login');
    }
  }, [])

  return (
    <>
      <AuthCheck>
        {isAuth && (
          // <h1>ラケット詳細ページ</h1>
          <div className="container mx-auto">
            <div className="text-center mb-6">
              <PrimaryHeading text="Rackets" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
            </div>

            {/* ラケットセクション */}
            <div className="w-[100%] max-w-[320px] mx-auto mb-8">
              <div className="flex md:w-[100%] md:max-w-[360px]">
                <div className="w-[120px] mr-6">
                  {racket?.racket_image.file_path
                    ? <img src={`${baseImagePath}${racket.racket_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[160px]" />
                    : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[160px]" />
                  }
                </div>

                <div className="w-[100%] max-w-[176px] pt-4 md:max-w-[216px]">
                  <p className="text-[14px] mb-2 pl-2 md:text-[16px]">{racket && firstLetterToUpperCase(racket.maker.name_en)}</p>
                  <p className="text-[16px] text-center mb-2 md:text-[18px]">{racket?.name_ja}</p>
                  <TextUnderBar className="w-[100%] max-w-[176px] md:max-w-[216px]" />
                </div>
              </div>
            </div>

            {/* ラケット情報セクション */}
            <div>
              <div className="w-[100%] max-w-[320px] mx-auto">
                <table className="flex justify-center w-[100%] max-w-[320px] ">
                  <thead className="w-[100%] max-w-[160px]">
                    <tr className="flex flex-col text-left ">
                      <th className="font-normal text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">メーカー</th>
                      <th className="font-normal text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">ヘッドサイズ</th>
                      <th className="font-normal text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">重さ</th>
                      <th className="font-normal text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">長さ</th>
                      <th className="font-normal text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">バランス</th>
                      <th className="font-normal text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">ストリングパターン</th>
                      <th className="font-normal text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-y border-sub-green">フレーム厚</th>
                    </tr>
                  </thead>
                  <tbody className="w-[100%] max-w-[320px]">
                    <tr className="flex flex-col text-left">
                      <td className="text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">{racket?.maker.name_ja}</td>
                      <td className="text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">645 cm² / 100 in²</td>
                      <td className="text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">310g</td>
                      <td className="text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">685mm/27in</td>
                      <td className="text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">330mm +/- 7mm</td>
                      <td className="text-[14px] min-h-[32px] leading-[32px] p-[0px] pl-1 border-t border-sub-green">16/19</td>
                      <td className="text-[14px] min-h-[16px] leading-[32px] p-[0px] pl-1 border-y border-sub-green">23/26/23mm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        )}
      </AuthCheck>
    </>
  );
}

export default RacketShow;
