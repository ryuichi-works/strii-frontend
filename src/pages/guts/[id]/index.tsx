import type { Gut } from "@/pages/reviews";
import axios from "@/lib/axios";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import { AuthContext } from "@/context/AuthContext";

import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import TextUnderBar from "@/components/TextUnderBar";
import Link from "next/link";

const Gut = () => {
  const router = useRouter();

  const [id, setId] = useState(router.query.id)

  const [gut, setGut] = useState<Gut>();

  const [otherGuts, setOtherGuts] = useState<Gut[]>();

  const otherGutsCount = 5;

  const { isAuth, user, isAuthAdmin } = useContext(AuthContext);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  useEffect(() => {
    const getGut = async () => {
      await axios.get(`/api/guts/${id}`).then(res => {
        setGut(res.data);
      })
    }

    const getOtherGuts = async () => {
      await axios.get(`/api/guts/${id}/others`, {
        params: { count: otherGutsCount }
      }).then(res => {
        setOtherGuts(res.data);
      })
    }

    getGut();
    getOtherGuts();
  }, [id])

  return (
    <>
      <Head>
        <title>ストリング - {gut ? (`${gut.name_ja} (${gut.maker.name_ja})`) : ''}</title>
      </Head>

      <div className="container md:mx-auto">
        <div className="text-center my-6 md:my-[32px]">
          <PrimaryHeading text="String" className="text-[18px] italic h-[20px] md:text-[20px] md:h-[22px]" />
        </div>

        {/* ガットセクション */}
        <div className="mb-[64px]">
          <div className="w-[100%] max-w-[320px] mx-auto mb-8 md:max-w-[400px] md:mb-[64px]">
            <div className="flex justify-center hover:opacity-80 hover:cursor-pointer">
              <div className="w-[120px] mr-6 md:w-[160px] md:mr-8">
                {gut?.gut_image.file_path
                  ? <img src={`${gut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />
                  : <img src={`${baseImagePath}images/guts/default_gut_image.png`} alt="ストリング画像" className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]" />
                }
              </div>

              <div className="w-[100%] max-w-[160px] md:max-w-[185px]">
                <p className="text-[14px] mb-2 md:text-[16px] md:mb-4">{gut?.maker.name_ja}</p>
                <p className="text-[16px] mb-2 md:text-[18px] md:mb-4">{gut?.name_ja}</p>
                <TextUnderBar className="w-[100%] max-w-[160px] md:max-w-[185px]" />
              </div>
            </div>
          </div>

          <div>
            <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[720px]">
              <table className="flex flex-row justify-start w-[100%] max-w-[320px] md:flex-col md:max-w-[720px]">
                <thead className="w-[100%] max-w-[120px] md:max-w-[720px] md:mb-4">
                  <tr className="flex flex-col items-start border-r border-sub-green w-[100%] max-w-[120px] md:flex-row md:max-w-[720px] md:border-r-0 md:border-b">
                    <th className="font-normal text-[14px] text-center w-[100%] max-w-[120px] min-h-[45px] leading-[45px] p-[0px] md:text-[16px] md:max-w-[180px]">メーカー</th>
                    <th className="font-normal text-[14px] text-center w-[100%] max-w-[120px] min-h-[45px] leading-[45px] p-[0px] tracking-tighter md:text-[16px] md:max-w-[180px]">種類</th>
                    <th className="font-normal text-[14px] text-center w-[100%] max-w-[120px] min-h-[45px] leading-[45px] p-[0px] md:text-[16px] md:max-w-[180px]">ゲージ</th>
                    <th className="font-normal text-[14px] text-center w-[100%] max-w-[120px] min-h-[45px] leading-[45px] p-[0px] md:text-[16px] md:max-w-[180px]">カラー</th>
                  </tr>
                </thead>

                <tbody className="w-[100%] max-w-[200px] md:max-w-[720px]">
                  <tr className="flex flex-col items-start w-[100%] max-w-[200px] md:flex-row md:max-w-[720px]">
                    <td className="pl-6 min-h-[45px] text-[14px] leading-[45px] p-[0px] md:text-[16px] md:pl-0 md:w-[100%] md:max-w-[180px] md:text-center">{gut?.maker.name_ja}</td>
                    <td className="pl-6 min-h-[45px] text-[14px] leading-[45px] p-[0px] md:text-[16px] md:pl-0 md:w-[100%] md:max-w-[180px] md:text-center">{gut?.category}</td>
                    <td className="pl-6 min-h-[45px] text-[12px] leading-[45px] p-[0px] md:text-[12px] md:pl-0 md:w-[100%] md:max-w-[180px] md:text-center">{gut?.guage}mm</td>
                    <td className="pl-6 min-h-[45px] text-[14px] leading-[45px] p-[0px] md:text-[16px] md:pl-0 md:w-[100%] md:max-w-[180px] md:text-center">未登録</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {isAuthAdmin && (
            <div className="flex justify-center w-[100%] max-w-[320px] mx-auto mt-6 md:max-w-[720px] md:justify-end">
              <Link href={`/guts/${gut?.id}/edit`}>
                <button type="button" className="text-white font-bold text-[14px] w-[200px] h-8 rounded  bg-sub-green">更新</button>
              </Link>
            </div>
          )}
        </div>

        {/* otherガットセクション */}
        <div className="">
          <p className="text-[14px] w-[100%] max-w-[320px] mx-auto mb-2 md:max-w-[768px] md:mb-[16px]">その他のストリング</p>
          <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:flex-wrap md:justify-between ">
            {/* ガット */}
            {otherGuts && otherGuts.map(otherGut => (
              <Link href={`/guts/${otherGut.id}`} key={otherGut.id} onClick={() => setId(`${otherGut.id}`)} className="block hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                <div className="flex justify-center mb-6 hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                  <div className="w-[120px] mr-6">
                    {otherGut.gut_image.file_path
                      ? <img src={`${otherGut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                      : <img src={`${baseImagePath}images/guts/default_gut_image.png`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                    }
                  </div>

                  <div className="w-[100%] max-w-[160px] md:max-w-[216px]">
                    <p className="text-[14px] mb-2 md:text-[16px]">{otherGut.maker.name_ja}</p>
                    <p className="text-[16px] mb-2 md:text-[18px]">{otherGut.name_ja}</p>
                    <TextUnderBar className="w-[100%] max-w-[160px] md:max-w-[216px]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Gut;
