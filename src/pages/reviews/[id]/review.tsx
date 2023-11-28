import type { Review } from "..";
import AuthCheck from "@/components/AuthCheck"
import { AuthContext } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const Review = () => {
  const router = useRouter();

  const { isAuth, user } = useContext(AuthContext);

  const [review, setReview] = useState<Review>();

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  useEffect(() => {
    if (user.id) {
      const getAllReviews = async () => {
        const id = router.query.id;
        await axios.get(`api/gut_reviews/${id}`).then(res => {
          setReview(res.data);
        })
      }

      getAllReviews();
    } else {
      router.push('/users/login');
    }
  }, [])

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <h1 className="text-center mb-6">Review</h1>
            <div className="container mx-auto">
              <div className="flex justify-center flex-wrap">

                {/* メインガット */}
                <div className="flex w-[360px] justify-center mb-6 py-2">
                  <div className="w-[120px] mr-[24px]">
                    {review?.my_equipment.stringing_way === 'hybrid' && <p className="text-[12px] basis-full">メイン</p>}
                    {/* <p className="text-[12px] basis-full">メイン</p> */}
                    {review?.my_equipment.main_gut.gut_image.file_path
                      ? <img src={`${baseImagePath}${review.my_equipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[120px] h-[120px]" />
                      : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="テニスストリング画像" className="w-[120px] h-[120px] rounded-full" />
                    }
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="mb-2">
                      <p className="h-[14px] text-[12px] mb-2 ml-[10px]">{review?.my_equipment.main_gut.maker.name_ja}</p>
                      <p className="h-[24px] text-[20px] text-center">{review?.my_equipment.main_gut.name_ja}</p>
                    </div>

                    <hr className="w-[196px] border-sub-green mb-[12px]" />

                    <div>
                      <p className="h-[14px] text-[12px] mr-auto mb-2 ml-[10px]">
                        ゲージ：{review?.my_equipment.main_gut_guage}
                        {review?.my_equipment.stringing_way === 'single' && `/${review?.my_equipment.cross_gut_guage}`}
                      </p>
                      <p className="h-[14px] text-[12px] mr-auto ml-[10px]">
                        テンション：{review?.my_equipment.main_gut_tension}
                        {review?.my_equipment.stringing_way === 'single' && `/${review?.my_equipment.cross_gut_tension}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* クロスガット */}
                {review?.my_equipment.stringing_way === 'hybrid' && (
                  <div className="flex w-[360px] justify-center mb-6 py-2">
                    <div className="w-[120px] mr-[24px]">
                      <p className="text-[12px] basis-full">クロス</p>
                      {review?.my_equipment.main_gut.gut_image.file_path
                        ? <img src={`${baseImagePath}${review.my_equipment.cross_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[120px] h-[120px]" />
                        : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="テニスストリング画像" className="w-[120px] h-[120px] rounded-full" />
                      }
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="mb-2">
                        <p className="h-[14px] text-[12px] mb-2 ml-[10px]">{review?.my_equipment.cross_gut.maker.name_ja}</p>
                        <p className="h-[24px] text-[20px] text-center">{review?.my_equipment.cross_gut.name_ja}</p>
                      </div>

                      <hr className="w-[196px] border-sub-green mb-[12px]" />

                      <div>
                        <p className="h-[14px] text-[12px] mr-auto mb-2 ml-[10px]">ゲージ：{review?.my_equipment.cross_gut_guage}</p>
                        <p className="h-[14px] text-[12px] mr-auto ml-[10px]">テンション：{review?.my_equipment.cross_gut_tension}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ユーザー＆テニスプロフィール */}
                <div className="mb-[32px] w-[360px]">
                  <div className="w-16 mx-auto mb-[10px]">
                    {review?.my_equipment.user.file_path
                      ? <img src={`${baseImagePath}${user.file_path}`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                      : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                    }

                    <p className="text-[10px] text-center w-full h-[12px] mb-2">{review?.my_equipment.user.name}</p>

                    <div className="w-8 h-1 bg-sub-green mx-auto"></div>
                  </div>

                  <div className="mx-auto w-[280px] mb-6">
                    <p className=" text-[12px] flex flex-wrap w-[280px]">
                      <span>ラケット：{review?.my_equipment.racket.name_ja} /　</span>
                      <span>テニス歴：{review?.my_equipment.user.tennis_profile?.experience_period}年 /　</span>
                      <span>テニス頻度：{review?.my_equipment.user.tennis_profile?.frequency} /　</span>
                      <span>プレイスタイル：{review?.my_equipment.user.tennis_profile?.play_style} /　</span>
                      <span>グリップ：{review?.my_equipment.user.tennis_profile?.grip_form} /　</span>
                      <span>好きなショット：{review?.my_equipment.user.tennis_profile?.favarit_shot} /　</span>
                      <span>苦手なショット：{review?.my_equipment.user.tennis_profile?.weak_shot} /　</span>
                      <span>年齢：{review?.my_equipment.user.tennis_profile?.age} /　</span>
                      <span>性別：{review?.my_equipment.user.tennis_profile?.gender} /　</span>
                      <span>背丈：{review?.my_equipment.user.tennis_profile?.height} /　</span>
                      <span>体格：{review?.my_equipment.user.tennis_profile?.physique}</span>
                    </p>
                  </div>
                  <hr className="w-[360px] border-t-sub-green"/>
                </div>


                {/* 評価値 */}
                {/* <div className="w-[320px] mb-6"> */}
                <div className="mb-6">
                  <ReviewBarGraph title="自分に合っているか" data={review?.match_rate} />
                  <ReviewBarGraph title="切れにくさ" data={review?.pysical_durability} />
                  <ReviewBarGraph title="打球感の持続力" data={review?.performance_durability} />
                </div>

                {/* レビューコメント */}
                <div className="mb-10">
                  <span className="block">レビュー</span>
                  <p className="border min-h-[120px] w-[280px] p-1">{review?.review}</p>
                </div>

              </div>
            </div>
          </>


        )}
      </AuthCheck>
    </>
  );
}

export const ReviewBarGraph = ({ title, data }: { title: string, data?: number }) => {
  return (
    <div className="flex justify-end mb-2">
      <span className="text-[14px] pr-1">{title}</span>
      <span className="inline-block w-[104px] h-[20px] border mr-2"></span>
      <span className="inline-block border-r-2 border-sub-green mr-1"></span>
      <span className="inline-block text-[14px] w-4">{data}</span>
    </div>
  );
}

export default Review;
