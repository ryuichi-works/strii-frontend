import type { MyEquipment } from "@/pages/reviews";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import axios from "@/lib/axios";

import AuthCheck from "@/components/AuthCheck";
import SubHeading from "@/components/SubHeading";
import TextUnderBar from "@/components/TextUnderBar";
import Link from "next/link";
import PrimaryHeading from "@/components/PrimaryHeading";

const MyEquipment = () => {
  const router = useRouter();

  const myEquipmentId = router.query.id

  const { isAuth, user } = useContext(AuthContext);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  const [myEquipment, setMyEquipment] = useState<MyEquipment>();

  useEffect(() => {
    if (user.id) {
      const getMyEquipment = async () => {
        await axios.get(`api/my_equipments/${myEquipmentId}`).then(res => {
          setMyEquipment(res.data);
        })
      }

      getMyEquipment();
    } else {
      router.push('/users/login');
    }
  }, [])

  return (
    <>
      <AuthCheck>
        {isAuth && (
          // <h1>マイ装備詳細</h1>
          <div className="container mb-8 mx-auto">
            <div className=" w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">
              <div className="text-center my-6 md:mb-[32px]">
                <PrimaryHeading text="Equipment" className="text-[18px] italic h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="md:flex md:flex-col md:max-h-[700px] md:flex-wrap">
                {/* ガットセクション */}
                <div className="flex flex-col items-center mb-8 md:w-[100%] md:max-w-[360px]">
                  <div className="w-[100%] max-w-[300px] mb-4 md:max-w-[360px]">
                    {myEquipment?.stringing_way === 'hybrid'
                      ? <SubHeading text='ストリング（ハイブリッド張り）' className="text-[16px] w-[100%] max-w-[300px] ml-[8px] mb-1 md:text-[18px] md:mb-2" />
                      : <SubHeading text='ストリング（単張り）' className="text-[16px] ml-[8px] mb-1 md:text-[18px] md:mb-2" />
                    }
                    <TextUnderBar className="w-[100%] max-w-[300px] md:max-w-[360px]" />
                  </div>

                  {/* ガット */}
                  <div className="flex justify-center w-[100%] max-w-[300px] md:flex-col md:max-w-[360px]">
                    {/* メインガット */}
                    <div className="md:flex md:mb-4">
                      <div className="md:mr-[24px]">
                        <p className="text-[14px] md:text-[16px]">メイン</p>
                        {myEquipment?.main_gut.gut_image.file_path
                          ? <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-1 md:w-[120px] md:h-[120px] md:mb-0" />
                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-1 md:w-[120px] md:h-[120px] md:mb-0" />
                        }
                      </div>

                      <div className="md:w-[185px] md:mt-[24px]">
                        <p className="text-[14px] mb-2 md:text-[16px] md:h-[18px]">{myEquipment?.main_gut.maker.name_ja}</p>
                        <p className="text-[14px] mb-2 md:text-[18px] md:text-center md:h-[20px]">{myEquipment?.main_gut.name_ja}</p>
                        <TextUnderBar className="w-[100%] max-w-[92px] mb-2 md:max-w-[185px]" />

                        {myEquipment?.stringing_way === 'hybrid'
                          ? (
                            <>
                              <p className="text-[14px] mb-2 md:text-[16px] md:h-[18px]">{myEquipment.main_gut_guage.toFixed(2)}ｍｍ</p>
                              <p className="text-[14px] md:text-[16px] md:h-[18px]">{myEquipment?.cross_gut_tension}ポンド</p>
                            </>
                          ) : (
                            <>
                              <p className="text-[14px] mb-2 md:text-[16px] md:h-[18px]">{myEquipment?.main_gut_guage.toFixed(2)}/{myEquipment?.cross_gut_guage.toFixed(2)}ｍｍ</p>
                              <p className="text-[14px] md:text-[16px] md:h-[18px]">{myEquipment?.main_gut_tension}/{myEquipment?.cross_gut_tension}ポンド</p>
                            </>
                          )
                        }
                      </div>
                    </div>

                    {/* クロスガット */}
                    {myEquipment?.stringing_way === 'hybrid' && (
                      <>
                        <div className="ml-[48px] md:ml-0 md:flex">
                          <div className="md:mr-[24px]">
                            <p className="text-[14px] md:text-[16px]">クロス</p>
                            {myEquipment?.main_gut.gut_image.file_path
                              ? <img src={`${baseImagePath}${myEquipment.cross_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-1 md:w-[120px] md:h-[120px] md:mb-0" />
                              : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-1 md:w-[120px] md:h-[120px] md:mb-0" />
                            }
                          </div>

                          <div className="md:w-[185px] md:mt-[24px]">
                            <p className="text-[14px] mb-2 md:text-[16px] md:h-[18px]">{myEquipment?.cross_gut.maker.name_ja}</p>
                            <p className="text-[14px] mb-2 md:text-[18px] md:text-center md:h-[20px]">{myEquipment?.cross_gut.name_ja}</p>
                            <TextUnderBar className="w-[100%] max-w-[92px] mb-2 md:max-w-[185px]" />
                            <p className="text-[14px] mb-2 md:text-[16px] md:h-[18px]">{myEquipment.cross_gut_guage.toFixed(2)}ｍｍ</p>
                            <p className="text-[14px] md:text-[16px] md:h-[18px]">{myEquipment?.cross_gut_tension}ポンド</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ラケットセクション */}
                <div className="flex flex-col items-center mb-8 md:w-[100%] md:max-w-[360px]">
                  <div className="w-[100%] max-w-[300px] mb-4 md:max-w-[360px]">
                    <SubHeading text='ラケット' className="text-[16px] ml-[8px] mb-1 md:text-[18px] md:mb-2" />
                    <TextUnderBar className="w-[100%] max-w-[300px] md:max-w-[360px]" />
                  </div>

                  {/* ラケット */}
                  <div className="flex justify-center md:justify-start">
                    <div className="mr-[24px]">
                      {myEquipment?.racket.racket_image.file_path
                        ? <img src={`${baseImagePath}${myEquipment?.racket.racket_image.file_path}`} alt="ラケット画像" className="w-[92px] h-[132px] mb-1 md:w-[120px] md:h-[160px] md:mb-0" />
                        : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="w-[92px] h-[132px] mb-1 md:w-[120px] md:h-[160px] md:mb-0" />
                      }
                    </div>

                    <div className="md:w-[185px]">
                      <p className="text-[14px] mb-2 md:text-[16px]">{myEquipment?.racket.maker.name_ja}</p>
                      <p className="text-[16px] mb-2 md:text-[18px] md:text-center">{myEquipment?.racket.name_ja}</p>
                      <TextUnderBar className="w-[100%] max-w-[116px] md:max-w-[185px]" />
                    </div>
                  </div>
                </div>

                <TextUnderBar className="w-[100%] max-w-[300px] mb-4 mx-auto md:hidden" />

                {/* ストリング日時セクション */}
                <div className="flex flex-col items-center mb-8 md:mt-[35px]">
                  <div className="w-[100%] max-w-[300px] border border-dashed border-black rounded-lg px-2 py-4 md:max-w-[360px] md:min-h-[240px] md:flex md:flex-col md:justify-center md:items-start md:pl-6">
                    <p className="text-[14px] text-right mb-2 md:test-[16px] md:mb-10">張った日：{myEquipment?.new_gut_date}</p>
                    <p className="tracking-tight text-[14px] text-right md:test-[16px] ">ストリング張り替え・切れた日：{myEquipment?.change_gut_date}</p>
                  </div>
                </div>

                {/* コメントセクション */}
                  <div className="flex flex-col items-center">
                    <p className="text-[14px] text-left w-[100%] max-w-[300px] md:text-[16px] md:mb-2 md:max-w-[360px]">コメント</p>
                    <p className="w-[100%] max-w-[300px] min-h-[160px] border p-2 md:max-w-[360px] md:min-h-[267px]" >{myEquipment?.comment}</p>
                  </div>
              </div>

              <div className="flex justify-center w-[100%] max-w-[320px] mx-auto mt-[24px] md:justify-end md:max-w-[768px]">
                <Link
                  href={`/my_equipments/${myEquipmentId}/edit`}
                  className="inline-block  text-[14px] text-white text-center leading-[32px] font-bold w-[80px] h-[32px] rounded  bg-sub-green md:text-[16px] md:w-[100px]"
                >編集</Link>
              </div>
            </div>
          </div>
        )}
      </AuthCheck>
    </>
  );
}

export default MyEquipment;
