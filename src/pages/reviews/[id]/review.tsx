import BarGraph, { EvaluationVal } from "@/components/BarGraph";
import type { Review } from "..";
import AuthCheck from "@/components/AuthCheck"
import { AuthContext } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Head from 'next/head';

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
            <Head>
              <title>
                レビュー - {review ? `${review?.my_equipment.main_gut.name_ja}(${review?.my_equipment.main_gut.maker.name_en})` : ''}
                {review?.my_equipment.stringing_way === 'hybrid'
                  ? `/${review?.my_equipment.cross_gut.name_ja}(${review?.my_equipment.cross_gut.maker.name_en})`
                  : ''}
              </title>
            </Head>

            <div className="container mx-auto">
              <h1 className="text-center my-[24px] italic md:my-[32px] md:text-[24px]">Review</h1>
              <div className="flex flex-col items-center flex-wrap">
                <div className="md:flex md:justify-center md:mb-[32px]">
                  {/* メインガット */}
                  <div className="flex w-[360px] justify-center mb-6 py-2 md:mr-[32px]">
                    <div className="w-[120px] mr-[24px] md:w-[140px]">
                      {review?.my_equipment.stringing_way === 'hybrid' && <p className="text-[12px] basis-full md:text-[14px] md:mb-2">メイン</p>}
                      {review?.my_equipment.main_gut.gut_image.file_path &&
                        <img src={`${review.my_equipment.main_gut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px] md:w-[140px] md:h-[140px]" />
                      }
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="mb-2">
                        <p className="h-[14px] text-[12px] mb-2 ml-[10px] md:text-[14px]">{review?.my_equipment.main_gut.maker.name_ja}</p>
                        <p className="h-[24px] text-[20px] text-center">{review?.my_equipment.main_gut.name_ja}</p>
                      </div>

                      <hr className="w-[196px] border-sub-green mb-[12px]" />

                      <div>
                        <p className="h-[14px] text-[12px] mr-auto mb-2 ml-[10px] md:text-[14px]">
                          ゲージ：{review?.my_equipment.main_gut_guage}
                          {review?.my_equipment.stringing_way === 'single' && `/${review?.my_equipment.cross_gut_guage}`}
                        </p>
                        <p className="h-[14px] text-[12px] mr-auto ml-[10px] md:text-[14px]">
                          テンション：{review?.my_equipment.main_gut_tension}
                          {review?.my_equipment.stringing_way === 'single' && `/${review?.my_equipment.cross_gut_tension}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* クロスガット */}
                  {review?.my_equipment.stringing_way === 'hybrid' && (
                    <div className="flex w-[360px] justify-center mb-6 py-2">
                      <div className="w-[120px] mr-[24px] md:w-[140px]">
                        <p className="text-[12px] basis-full md:text-[14px] md:mb-2">クロス</p>
                        {review?.my_equipment.cross_gut.gut_image.file_path &&
                          <img src={`${review.my_equipment.cross_gut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px] md:w-[140px] md:h-[140px]" />
                        }
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="mb-2">
                          <p className="h-[14px] text-[12px] mb-2 ml-[10px] md:text-[14px]">{review?.my_equipment.cross_gut.maker.name_ja}</p>
                          <p className="h-[24px] text-[20px] text-center">{review?.my_equipment.cross_gut.name_ja}</p>
                        </div>

                        <hr className="w-[196px] border-sub-green mb-[12px]" />

                        <div>
                          <p className="h-[14px] text-[12px] mr-auto mb-2 ml-[10px] md:text-[14px]">ゲージ：{review?.my_equipment.cross_gut_guage}</p>
                          <p className="h-[14px] text-[12px] mr-auto ml-[10px] md:text-[14px]">テンション：{review?.my_equipment.cross_gut_tension}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ユーザー＆テニスプロフィール */}
                <div className="mb-[32px] w-[360px] md:flex md:justify-center md:basis-full md:w-full">
                  <div className="w-16 mx-auto mb-[10px] md:w-[100px] md:mr-[56px] md:mx-0">
                    {review?.my_equipment.user.file_path
                      ? <img src={`${review?.my_equipment.user.file_path}`} alt="ユーザープロフィール画像" className="w-[64px] h-[64px] rounded-full border mb-2 md:w-[100px] md:h-[100px]" />
                      : <img src={`${baseImagePath}images/users/defalt_user_image.png`} width="64px" height="64px" alt="ユーザープロフィール画像" className="w-[64px] md:w-[80px] h-[64px] md:h-[80px] rounded-full border mb-2" />
                    }

                    <p className="text-[10px] text-center w-full h-[12px] mb-2 md:text-[16px] md:h-[18px]">{review?.my_equipment.user.name}</p>

                    <div className="w-8 h-1 bg-sub-green mx-auto md:w-[50px]"></div>
                  </div>

                  <div className="mx-auto w-[280px] mb-6 md:mx-0 md:w-[520px] md:self-center">
                    <p className=" text-[12px] flex flex-wrap w-[280px] md:text-[16px] md:w-[520px]">
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
                  <hr className="w-[360px] border-t-sub-green md:hidden" />
                </div>

                {/* 評価値 */}
                <div className="w-[320px] md:flex md:justify-between md:w-[768px] ">
                  <div className="mb-6 w-[320px] md:w-[360px]  md:mb-0 md:pt-[24px]">
                    <div className="flex justify-end mb-2">
                      <span className="text-[14px] h-[16px] leading-[16px] pr-1 md:text-[16px] md:h-[18px] md:leading-[18px]">自分に合っているか</span>
                      {review && (
                        <BarGraph
                          evaluationVal={review.match_rate as EvaluationVal}
                          areaSize="md"
                          graphHeight="h-[16px] md:h-[18px]"
                        />
                      )}
                      <span className="inline-block border-r-2 border-sub-green ml-2 mr-1"></span>
                      <span className="inline-block text-[14px] text-center h-[16px] w-6 leading-[16px] md:text-[16px] md:h-[18px] md:leading-[18px]">{review?.match_rate}</span>
                    </div>

                    <div className="flex justify-end mb-2">
                      <span className="text-[14px] h-[16px] leading-[16px] pr-1 md:text-[16px] md:h-[18px] md:leading-[18px]">切れにくさ</span>
                      {review && (
                        <BarGraph
                          evaluationVal={review.pysical_durability as EvaluationVal}
                          areaSize="md"
                          graphHeight="h-[16px] md:h-[18px]"
                        />
                      )}
                      <span className="inline-block border-r-2 border-sub-green ml-2 mr-1"></span>
                      <span className="inline-block text-[14px] text-center h-[16px] w-6 leading-[16px] md:text-[16px] md:h-[18px] md:leading-[18px]">{review?.pysical_durability}</span>
                    </div>

                    <div className="flex justify-end mb-2">
                      <span className="text-[14px] h-[16px] leading-[16px] pr-1 md:text-[16px] md:h-[18px] md:leading-[18px]">打球感の持続力</span>
                      {review && (
                        <BarGraph
                          evaluationVal={review.performance_durability as EvaluationVal}
                          areaSize="md"
                          graphHeight="h-[16px] md:h-[18px]"
                        />
                      )}
                      <span className="inline-block border-r-2 border-sub-green ml-2 mr-1"></span>
                      <span className="inline-block text-[14px] text-center h-[16px] w-6 leading-[16px] md:text-[16px] md:h-[18px] md:leading-[18px]">{review?.performance_durability}</span>
                    </div>

                    <p className="text-[14px] text-gray-500 text-end">max 5.0</p>
                  </div>

                  {/* レビューコメント */}
                  <div className="mb-10">
                    <span className="block">レビュー</span>
                    <p className="border min-h-[120px] w-[320px] p-1 md:w-[360px]">{review?.review}</p>
                  </div>

                </div>

              </div>

              <div className="flex justify-center w-[100%] max-w-[320px] mx-auto mt-[24px] md:justify-end md:max-w-[768px]">
                {(review && user.id === review.user_id) && (
                  <Link
                    href={`/reviews/${review.id}/edit`}
                    className="inline-block  text-[14px] text-white text-center leading-[32px] font-bold w-[80px] h-[32px] rounded  bg-sub-green md:text-[16px] md:w-[100px]"
                  >編集</Link>
                )}
              </div>
            </div>
          </>


        )}
      </AuthCheck>
    </>
  );
}

export default Review;
