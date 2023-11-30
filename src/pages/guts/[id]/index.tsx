import type { Gut } from "@/pages/reviews";
import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import { AuthContext } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import TextUnderBar from "@/components/TextUnderBar";
import Link from "next/link";

const Gut = () => {
  const router = useRouter();

  // const id = router.query.id;
  const [id, setId] = useState(router.query.id)

  const [gut, setGut] = useState<Gut>();

  const [otherGuts, setOtherGuts] = useState<Gut[]>();
  const otherGutsCount = 5;
  console.log(otherGuts);
  const { isAuth, user, setUser, setIsAuth } = useContext(AuthContext);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'


  useEffect(() => {
    if (user.id) {
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
    } else {
      router.push('/users/login');
    }
  }, [id])

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            {/* <h1>ストリング詳細</h1> */}
            <div className="container md:mx-auto">
              <div className="text-center mb-6">
                <PrimaryHeading text="String" className="text-[18px] h-[20px]" />
              </div>

              {/* ガットセクション */}
              <div className="mb-[64px]">

                <div className="w-[100%] max-w-[320px] mx-auto mb-8">
                  <div className="flex hover:opacity-80 hover:cursor-pointer">
                    <div className="w-[120px] mr-6">
                      {gut?.gut_image.file_path
                        ? <img src={`${baseImagePath}${gut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                        : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                      }
                    </div>

                    <div className="w-[100%] max-w-[160px]">
                      <p className="text-[14px] mb-2">{gut?.maker.name_ja}</p>
                      <p className="text-[16px] mb-2">{gut?.name_ja}</p>
                      <TextUnderBar className="w-[100%] max-w-[160px]" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="w-[100%] max-w-[320px] mx-auto">
                    <table className="flex flex-row justify-start w-[100%] max-w-[320px]">
                      <thead className="w-[100%] max-w-[120px]">
                        <tr className="flex flex-col items-start border-r border-sub-green w-[100%] max-w-[120px]">
                          <th className="font-normal text-[14px] text-center w-[100%] max-w-[120px] min-h-[45px] leading-[45px] p-[0px]">メーカー</th>
                          <th className="font-normal text-[14px] text-center w-[100%] max-w-[120px] min-h-[45px] leading-[45px] p-[0px]">カラー</th>
                          <th className="font-normal text-[14px] text-center w-[100%] max-w-[120px] min-h-[45px] leading-[45px] p-[0px]">ゲージ</th>
                          <th className="font-normal text-[14px] text-center w-[100%] max-w-[120px] text-[15px] min-h-[45px] leading-[45px] p-[0px] tracking-tighter">ストリングの種類</th>
                        </tr>

                      </thead>
                      <tbody className="w-[100%] max-w-[200px]">
                        <tr className="flex flex-col items-start w-[100%] max-w-[200px]">
                          <td className="pl-6 min-h-[45px] text-[14px] leading-[45px] p-[0px]">バボラ</td>
                          <td className="pl-6 min-h-[45px] text-[14px] leading-[45px] p-[0px]">black/white</td>
                          <td className="pl-6 min-h-[45px] text-[12px] leading-[45px] p-[0px]">1.20/1.25/1.30/1.25/1.30mm</td>
                          <td className="pl-6 min-h-[45px] text-[14px] leading-[45px] p-[0px]">ポリエステル</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* otherガットセクション */}
              <div className="">
                <p className="text-[14px] w-[100%] max-w-[320px] mx-auto mb-2">その他のストリング</p>
                <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:flex-wrap md:justify-between ">
                  {/* ガット */}
                  {otherGuts && otherGuts.map(otherGut => (
                    <Link href={`/guts/${otherGut.id}`} key={otherGut.id} onClick={() => setId(`${otherGut.id}`)} className="block hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                      <div className="flex  mb-6 hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                        <div className="w-[120px] mr-6">
                          {otherGut.gut_image.file_path
                            ? <img src={`${baseImagePath}${otherGut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                            : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
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

        )}
      </AuthCheck>
    </>
  );
}

export default Gut;
