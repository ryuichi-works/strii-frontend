import type { MyEquipment } from "@/pages/reviews";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

import AuthCheck from "@/components/AuthCheck";
import axios from "@/lib/axios";
import { useRouter } from "next/router";

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
          <div className="container mb-8">
            <div className=" w-[100%] max-w-[320px] mx-auto">
              <div className="mb-6">
                <h1 className="text-[18px] text-center">Equipment</h1>
              </div>

              {/* ガットセクション */}
              <div className="mb-8">
                <div className="w-[100%] max-w-[300px] mb-4">
                  {myEquipment?.stringing_way === 'hybrid'
                    ? <SubHeading text='ストリング（ハイブリッド張り）' className="text-[16px] w-[100%] max-w-[300px] ml-[8px] mb-1" />
                    : <SubHeading text='ストリング（単張り）' className="text-[16px] ml-[8px] mb-1" />
                  }
                  <TextUnderBar className="w-[100%] max-w-[300px]" />
                </div>

                {/* ガット */}
                <div className="flex justify-center w-[100%] max-w-[300px]">
                  {/* メインガット */}
                  <div>
                    <div>
                      <p className="text-[14px]">メイン</p>
                      {myEquipment?.main_gut.gut_image.file_path
                        ? <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-1" />
                        : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-1" />
                      }
                    </div>

                    <div>
                      <p className="text-[14px] mb-2">Baborat</p>
                      <p className="text-[14px] mb-2">RPM ブラスト</p>
                      <TextUnderBar className="w-[100%] max-w-[92px] mb-2" />
                      <p className="text-[14px] mb-2">1.24ｍｍ</p>
                      <p className="text-[14px]">50ポンド</p>
                    </div>
                  </div>

                  {/* クロスガット */}
                  {myEquipment?.stringing_way === 'hybrid' && (
                    <>
                      <div className="ml-[48px]">
                        <div>
                          <p className="text-[14px]">メイン</p>
                          {myEquipment?.main_gut.gut_image.file_path
                            ? <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-1" />
                            : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-1" />
                          }
                        </div>

                        <div>
                          <p className="text-[14px] mb-2">Baborat</p>
                          <p className="text-[14px] mb-2">RPM ブラスト</p>
                          <TextUnderBar className="w-[100%] max-w-[92px] mb-2" />
                          <p className="text-[14px] mb-2">1.24ｍｍ</p>
                          <p className="text-[14px]">50ポンド</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ラケットセクション */}
              <div className="mb-8">
                <div className="w-[100%] max-w-[300px] mb-4">
                  <SubHeading text='ラケット' className="text-[16px] ml-[8px] mb-1" />
                  <TextUnderBar className="w-[100%] max-w-[300px]" />
                </div>

                {/* ラケット */}
                <div className="flex justify-center ">
                  <div className="mr-[24px]">
                    {myEquipment?.racket.racket_image.file_path
                      ? <img src={`${baseImagePath}${myEquipment?.racket.racket_image.file_path}`} alt="ラケット画像" className="w-[92px] h-[132px] mb-1" />
                      : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="w-[92px] h-[132px] mb-1" />
                    }
                  </div>

                  <div>
                    <p className="text-[14px] mb-2">baborat</p>
                    <p className="text-[16px] mb-2">ピュアアエロ</p>
                    <TextUnderBar className="w-[100%] max-w-[116px]" />
                  </div>
                </div>
              </div>

              <TextUnderBar className="w-[100%] max-w-[300px] mb-4" />

              {/* ストリング日時セクション */}
              <div className="mb-8">
                <div className="w-[100%] max-w-[300px] border border-dashed border-black rounded-lg px-2 py-4">
                  <p className="text-[14px] text-right mb-2">張った日：{myEquipment?.new_gut_date}</p>
                  <p className="tracking-tight text-[14px] text-right">ストリング張り替え・切れた日：{myEquipment?.change_gut_date}</p>
                </div>
              </div>

              {/* コメントセクション */}
              <div>
                <div>
                  <p className="text-[14px] ">コメント</p>
                  <p className="w-[100%] max-w-[300px] min-h-[160px] border p-2" >{myEquipment?.comment}</p>
                </div>
              </div>

            </div>
          </div>

        )}
      </AuthCheck>
    </>
  );
}

const SubHeading: React.FC<{ text: string, className?: string }> = ({
  text,
  className
}) => {
  return (
    <h2 className={`${className}`}>{text}</h2>
  );
}

const TextUnderBar: React.FC<{ barColor?: string, className?: string }> = ({
  barColor = 'border-sub-green',
  className
}) => {
  return (
    <hr className={`${barColor} ${className}`} />
  );
}

export default MyEquipment;
