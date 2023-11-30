import type { MyEquipment } from "../reviews";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/lib/axios";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import AuthCheck from "@/components/AuthCheck";

const MyEquipmentList = () => {
  const router = useRouter();

  const { isAuth, user } = useContext(AuthContext);

  const [myEquipments, setMyEquipments] = useState<MyEquipment[]>();

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  useEffect(() => {
    if (user.id) {
      const getAllMyEquipmentOfUser = async () => {
        await axios.get(`api/my_equipments/user/${user.id}`).then(res => {
          setMyEquipments(res.data);
        })
      }

      getAllMyEquipmentOfUser();
    } else {
      router.push('/users/login');
    }
  }, [])

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <div className="container mx-auto px-2">
              <div className="mb-4">
                <h1 className="text-center text-[20px] md:text-[32px]">Equipments</h1>
              </div>

              <div className="flex justify-center mb-6 md:w-[784px] md:mx-auto md:justify-end">
                <button className="text-white text-[14px] max-w-[264px] w-[100%] h-8 rounded  bg-sub-green md:w-[104px]">検索</button>
              </div>

              <div className="flex flex-col items-center md:flex-row md:flex-wrap md:w-[784px] md:justify-between md:mx-auto">
                {myEquipments && (
                  myEquipments.map(myEquipment => {
                    return (
                      <>
                        <Link href={`/my_equipments/${myEquipment.id}/my_equipment`} className="block max-w-[360px] w-[100%] min-h-[280px] mb-6 md:mb-16">
                          <div key={myEquipment.id} className="max-w-[360px] w-[100%] min-h-[280px] border border-gray-400 rounded  flex flex-col justify-around py-4 hover:cursor-pointer">
                            {myEquipment.stringing_way === "single" && (
                              <>
                                <div className=" flex justify-center mb-6">
                                  <div className="mr-8">
                                    <div className="w-[92px] flex flex-col justify-start items-start ">
                                      <div className="w-[92px]">
                                        {myEquipment.main_gut.gut_image.file_path
                                          ? <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-2" />
                                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                        }
                                      </div>

                                      <div className="mb-1">
                                        <p className="h-[16px] text-[14px] mb-2">{myEquipment.main_gut.maker.name_ja}</p>
                                        <p className="tracking-tighter min-h-[16px] text-[14px]">{myEquipment.main_gut.name_ja}</p>
                                      </div>

                                      <div>
                                        <p className="tracking-tighter h-[16px] text-[14px] mr-auto mb-[4px]">{myEquipment.main_gut_guage.toFixed(2)} / {myEquipment.cross_gut_guage.toFixed(2)} mm</p>
                                        <p className="tracking-tighter h-[16px] text-[14px] mr-auto">{myEquipment.main_gut_tension} / {myEquipment.cross_gut_tension} ポンド</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="w-[92px] flex flex-col items-center">
                                      {myEquipment.main_gut.gut_image.file_path
                                        ? <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[60px] h-[92px] mb-4" />
                                        : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                      }
                                      <div className="text-center">
                                        <p className="h-[16px] text-[14px] mb-4">{myEquipment.racket.maker.name_ja}</p>
                                        <p className="tracking-tighter break-words min-h-[16px] text-[14px] max-w-[92px] ">{myEquipment.racket.name_ja}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {myEquipment.stringing_way === "hybrid" && (
                              <>
                                <div className=" flex justify-center mb-6">
                                  <div className="mr-[18px]">
                                    <div className="w-[92px] flex flex-col justify-start items-start ">
                                      <div className="w-[92px]">
                                        {myEquipment.main_gut.gut_image.file_path
                                          ? <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-2" />
                                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                        }
                                      </div>

                                      <div className="mb-1">
                                        <p className="h-[16px] text-[14px] mb-2">{myEquipment.main_gut.maker.name_ja}</p>
                                        <p className="tracking-tighter min-h-[16px] text-[14px] ">{myEquipment.main_gut.name_ja}</p>
                                      </div>

                                      <div>
                                        <p className="tracking-tighter h-[16px] text-[14px] mr-auto mb-[4px]">{myEquipment.main_gut_guage.toFixed(2)} mm</p>
                                        <p className="tracking-tighter h-[16px] text-[14px] mr-auto">{myEquipment.main_gut_tension} ポンド</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mr-[18px]">
                                    <div className="w-[92px] flex flex-col justify-start items-start ">
                                      <div className="w-[92px]">
                                        {myEquipment.main_gut.gut_image.file_path
                                          ? <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-2" />
                                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-2" />
                                        }
                                      </div>

                                      <div className="mb-1">
                                        <p className="h-[16px] text-[14px] mb-2">{myEquipment.cross_gut.maker.name_ja}</p>
                                        <p className="tracking-tighter min-h-[16px] text-[14px] ">{myEquipment.cross_gut.name_ja}</p>
                                      </div>

                                      <div>
                                        <p className="tracking-tighter h-[16px] text-[14px] mr-auto mb-[4px]">{myEquipment.main_gut_guage.toFixed(2)} mm</p>
                                        <p className="tracking-tighter h-[16px] text-[14px] mr-auto">{myEquipment.main_gut_tension} ポンド</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="w-[92px] flex flex-col items-center">
                                      {myEquipment.main_gut.gut_image.file_path
                                        ? <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[60px] h-[92px] mb-4" />
                                        : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                      }

                                      <div className="text-center">
                                        <p className="h-[16px] text-[14px] mb-4">{myEquipment.racket.maker.name_ja}</p>
                                        <p className="tracking-tighter break-words min-h-[16px] text-[14px] max-w-[92px] ">{myEquipment.racket.name_ja}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <hr className="w-[320px] border-sub-green mb-2 mx-auto" />

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
            </div>
          </>

        )}
      </AuthCheck>
    </>
  );
}

export default MyEquipmentList