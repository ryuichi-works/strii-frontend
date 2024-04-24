import type { MyEquipment } from "../reviews";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/lib/axios";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import Head from 'next/head';
import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import Pagination, { Paginator } from "@/components/Pagination";

const MyEquipmentList = () => {
  const router = useRouter();

  const { isAuth, user } = useContext(AuthContext);

  const [myEquipments, setMyEquipments] = useState<MyEquipment[]>();

  const [myEquipmentsPaginator, setMyEquipmentsPaginator] = useState<Paginator<MyEquipment>>();

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  //ページネーションを考慮したmyEquipment一覧データの取得関数
  const getMyEquipmentListOfUser = async (url: string = `api/my_equipments/user/${user.id}`) => {
    await axios.get(url).then(res => {
      console.log('res', res.data)
      setMyEquipmentsPaginator(res.data)
      setMyEquipments(res.data.data);
    })
  }

  useEffect(() => {
    if (user.id) {
      getMyEquipmentListOfUser();
    } else {
      router.push('/users/login');
    }
  }, [])

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <Head>
              <title>マイ装備一覧</title>
            </Head>

            <div className="container mx-auto px-2">
              <div className="text-center my-6 md:my-[32px]">
                <PrimaryHeading text="Equipments" className="text-[18px] italic h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              {/* <div className="flex justify-center mb-6 md:w-[784px] md:mx-auto md:justify-end">
                <button className="text-white text-[14px] max-w-[264px] w-[100%] h-8 rounded  bg-sub-green md:w-[104px]">検索</button>
              </div> */}

              <div className="flex flex-col items-center md:flex-row md:flex-wrap md:w-[784px] md:justify-between md:mx-auto">
                {myEquipments && (
                  myEquipments.map(myEquipment => {
                    return (
                      <>
                        <Link href={`/my_equipments/${myEquipment.id}/my_equipment`} className="block max-w-[360px] w-[100%] min-h-[280px] mb-6 md:mb-16">
                          <div key={myEquipment.id} className="max-w-[360px] w-[100%] h-[280px] border border-gray-400 rounded  flex flex-col justify-around py-4 hover:cursor-pointer">
                            {myEquipment.stringing_way === "single" && (
                              <>
                                <div className=" flex justify-center">
                                  <div className="mr-8">
                                    <div className="w-[92px] flex flex-col justify-start items-start ">
                                      <div className="w-[92px]">
                                        {myEquipment.main_gut.gut_image.file_path &&
                                          <img src={`${myEquipment.main_gut.gut_image.file_path}`} alt="ストリング画像" className="w-[92px] h-[92px] mb-1" />
                                        }
                                      </div>

                                      <div className="mb-1">
                                        <p className="h-[10px] text-[10px] mb-2">{myEquipment.main_gut.maker.name_ja}</p>
                                        <p className="tracking-tighter min-h-[16px] text-[14px]">{myEquipment.main_gut.name_ja}</p>
                                      </div>

                                      <div>
                                        <p className="tracking-tighter h-[12px] text-[10px] mr-auto mb-[4px]">{myEquipment.main_gut_guage.toFixed(2)} / {myEquipment.cross_gut_guage.toFixed(2)} mm</p>
                                        <p className="tracking-tighter h-[12px] text-[10px] mr-auto">{myEquipment.main_gut_tension} / {myEquipment.cross_gut_tension} ポンド</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="w-[92px] flex flex-col items-center">
                                      {myEquipment.racket.racket_image.file_path &&
                                        <img src={`${myEquipment.racket.racket_image.file_path}`} alt="ラケット画像" className="w-[69px] h-[92px] mb-1" />
                                      }
                                      <div className="text-center">
                                        <p className="h-[10px] text-[10px] mb-2">{myEquipment.racket.maker.name_ja}</p>
                                        <p className="tracking-tighter break-words min-h-[16px] text-[14px] text-left max-w-[92px] ">{myEquipment.racket.name_ja}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {myEquipment.stringing_way === "hybrid" && (
                              <>
                                <div className=" flex justify-center">
                                  <div className="mr-[18px]">
                                    <div className="w-[92px] flex flex-col justify-start items-start ">
                                      <div className="w-[92px]">
                                        {myEquipment.main_gut.gut_image.file_path && 
                                          <img src={`${myEquipment.main_gut.gut_image.file_path}`} alt="ストリング画像" className="w-[92px] h-[92px] mb-1" />
                                        }
                                      </div>

                                      <div className="mb-1">
                                        <p className="h-[10px] text-[10px] mb-2">{myEquipment.main_gut.maker.name_ja}</p>
                                        <p className="tracking-tighter min-h-[16px] text-[14px] ">{myEquipment.main_gut.name_ja}</p>
                                      </div>

                                      <div>
                                        <p className="tracking-tighter h-[12px] text-[10px] mr-auto mb-[4px]">{myEquipment.main_gut_guage.toFixed(2)} mm</p>
                                        <p className="tracking-tighter h-[12px] text-[10px] mr-auto">{myEquipment.main_gut_tension} ポンド</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mr-[18px]">
                                    <div className="w-[92px] flex flex-col justify-start items-start ">
                                      <div className="w-[92px]">
                                        {myEquipment.cross_gut.gut_image.file_path &&
                                          <img src={`${myEquipment.cross_gut.gut_image.file_path}`} alt="ストリング画像" className="w-[92px] h-[92px] mb-1" />
                                        }
                                      </div>

                                      <div className="mb-1">
                                        <p className="h-[10px] text-[10px] mb-2">{myEquipment.cross_gut.maker.name_ja}</p>
                                        <p className="tracking-tighter min-h-[16px] text-[14px] ">{myEquipment.cross_gut.name_ja}</p>
                                      </div>

                                      <div>
                                        <p className="tracking-tighter h-[12px] text-[10px] mr-auto mb-[4px]">{myEquipment.main_gut_guage.toFixed(2)} mm</p>
                                        <p className="tracking-tighter h-[12px] text-[10px] mr-auto">{myEquipment.main_gut_tension} ポンド</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="w-[92px] flex flex-col items-center">
                                      {myEquipment.racket.racket_image.file_path &&
                                        <img src={`${myEquipment.racket.racket_image.file_path}`} alt="ラケット画像" className="w-[69px] h-[92px] mb-1" />
                                      }

                                      <div className="text-center">
                                        <p className="h-[10px] text-[10px] mb-2">{myEquipment.racket.maker.name_ja}</p>
                                        <p className="tracking-tighter break-words min-h-[16px] text-[14px] text-left max-w-[92px] ">{myEquipment.racket.name_ja}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <hr className="w-[320px] border-sub-green mt-auto mb-2 mx-auto" />

                            <div className="flex flex-col items-end mr-[24px]">
                              <span className="inline-block h-[16px] text-[14px] mb-2">張った日：{myEquipment.new_gut_date}</span>
                              <span className="inline-block h-[16px] text-[14px] ">張り替え・ストリングが切れた日：{myEquipment.change_gut_date}</span>
                            </div>
                          </div>
                        </Link>
                      </>
                    );
                  })
                )}
              </div>

              {/* ページネーション */}
              <Pagination
                paginator={myEquipmentsPaginator}
                paginate={getMyEquipmentListOfUser}
                className="mt-[32px] md:mt-[48px]"
              />
            </div>
          </>

        )}
      </AuthCheck>
    </>
  );
}

export default MyEquipmentList
