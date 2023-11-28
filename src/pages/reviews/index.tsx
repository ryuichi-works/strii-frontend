import { Maker, Racket, RacketImage } from "../users/[id]/profile";
import type { User } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import Link from "next/link";

type GutImage = {
  id: number,
  file_path: string,
  title: string,
  created_at: string,
  updated_at: string
}

type Gut = {
  id: number,
  name_ja: string,
  name_en: string,
  maker_id: number,
  image_id: number,
  need_posting_image: number,
  created_at: string,
  updated_at: string,
  maker: Maker,
  gut_image: GutImage
}

type MyEquipment = {
  id: number,
  user_id: number,
  user_height: string,
  user_age: string,
  experience_period: number,
  racket_id: number,
  stringing_way: string,
  main_gut_id: number,
  cross_gut_id: number,
  main_gut_guage: number,
  cross_gut_guage: number,
  main_gut_tension: number,
  cross_gut_tension: number,
  new_gut_date: string,
  change_gut_date: null,
  comment: string,
  created_at: string,
  updated_at: string,
  main_gut: Gut,
  cross_gut: Gut,
  racket: Racket,
  user: User
}

export type Review = {
  id: number,
  equipment_id: number,
  match_rate: number,
  pysical_durability: number,
  performance_durability: number,
  review: string,
  created_at: string,
  updated_at: string,
  my_equipment: MyEquipment
}

const ReviewList = () => {
  const router = useRouter();

  const { isAuth, user, setUser, setIsAuth } = useContext(AuthContext);

  const [reviews, setReviews] = useState<Review[]>();
  console.log(reviews);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  useEffect(() => {
    if (user.id) {
      const getAllReviews = async () => {
        await axios.get('api/gut_reviews').then(res => {
          setReviews(res.data);
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
            <div className="container mx-auto">
              <div className="mb-4">
                <h1 className="text-center text-[20px] md:text-[32px]">Reviews</h1>
              </div>

              <div className="flex justify-center mb-6 md:w-[784px] md:mx-auto md:justify-end">
                <button className="text-white text-[14px] w-[264px] h-8 rounded  bg-sub-green md:w-[104px]">検索</button>
              </div>

              <div className="flex flex-col items-center md:flex-row md:flex-wrap md:w-[784px] md:justify-between md:mx-auto">
                {reviews && (
                  reviews.map(review => {
                    return (
                      <>
                        <Link href={`/reviews/${review.id}/review`}>
                          <div key={review.id} className="w-[360px] h-[280px] border border-gray-400 rounded mb-6 flex flex-col justify-around py-4 hover:cursor-pointer">
                            {review.my_equipment.stringing_way === "single" && (
                              <>
                                <div className=" flex justify-center mb-8">
                                  <div className="mr-10">
                                    <div className="w-[92px] h-[92px] flex justify-center items-center mb-10">
                                      <div className="w-16">
                                        {review.my_equipment.user.file_path
                                          ? <img src={`${baseImagePath}${user.file_path}`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                        }

                                        <p className="text-[10px] text-center w-full h-[12px] mb-2">{review.my_equipment.user.name}</p>

                                        <div className="w-8 h-1 bg-sub-green mx-auto"></div>
                                      </div>
                                    </div>

                                    <div className="w-[92px]  flex flex-col justify-center items-center">
                                      <p className="text-[10px]">ラケット</p>
                                      <p className="text-[10px]">{review.my_equipment.racket.maker.name_ja}</p>
                                      <p className="text-[10px]">{review.my_equipment.racket.name_ja}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="w-[92px] h-[92px] flex flex-col justify-start items-start mb-10">
                                      <div className="w-[92px]">
                                        {review.my_equipment.main_gut.gut_image.file_path
                                          ? <img src={`${baseImagePath}${review.my_equipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-2" />
                                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                        }
                                      </div>

                                      <div>
                                        <p className="h-[10px] text-[10px] mr-auto mb-2">Babolat</p>
                                        <p className="h-8 text-[14px] mr-auto">RPMブラスト</p>
                                      </div>

                                      <div>
                                        <p className="h-[12px] text-[10px] mr-auto mb-[4px]">ゲージ：1.25</p>
                                        <p className="h-[12px] text-[10px] mr-auto">テンション：40</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {review.my_equipment.stringing_way === "hybrid" && (
                              <>
                                <div className=" flex justify-center mb-8">
                                  <div className="mr-4">
                                    <div className="w-[92px] h-[92px] flex justify-center items-center mb-10">
                                      <div className="w-16">
                                        {review.my_equipment.user.file_path
                                          ? <img src={`${baseImagePath}${user.file_path}`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                        }

                                        <p className="text-[10px] text-center w-full h-[12px] mb-2">{review.my_equipment.user.name}</p>

                                        <div className="w-8 h-1 bg-sub-green mx-auto"></div>
                                      </div>
                                    </div>

                                    <div className="w-[92px]  flex flex-col justify-center items-center">
                                      <p className="text-[10px]">ラケット</p>
                                      <p className="text-[10px]">{review.my_equipment.racket.maker.name_ja}</p>
                                      <p className="text-[10px]">{review.my_equipment.racket.name_ja}</p>
                                    </div>
                                  </div>

                                  <div className="mr-4">
                                    <div className="w-[92px] h-[92px] flex flex-col justify-start items-start mb-10">
                                      <div className="w-[92px]">
                                        {review.my_equipment.main_gut.gut_image.file_path
                                          ? <img src={`${baseImagePath}${review.my_equipment.main_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-2" />
                                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                        }
                                      </div>

                                      <div>
                                        <p className="h-[10px] text-[10px] mr-auto mb-2">Babolat</p>
                                        <p className="h-8 text-[14px] mr-auto">RPMブラスト</p>
                                      </div>

                                      <div>
                                        <p className="h-[12px] text-[10px] mr-auto mb-[4px]">ゲージ：1.25</p>
                                        <p className="h-[12px] text-[10px] mr-auto">テンション：40</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="w-[92px] h-[92px] flex flex-col justify-start items-start mb-10">
                                      <div className="w-[92px]">
                                        {review.my_equipment.main_gut.gut_image.file_path
                                          ? <img src={`${baseImagePath}${review.my_equipment.cross_gut.gut_image.file_path}`} alt="ユーザープロフィール画像" className="w-[92px] h-[92px] mb-2" />
                                          : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2" />
                                        }
                                      </div>

                                      <div>
                                        <p className="h-[10px] text-[10px] mr-auto mb-2">Babolat</p>
                                        <p className="h-8 text-[14px] mr-auto">RPMブラスト</p>
                                      </div>

                                      <div>
                                        <p className="h-[12px] text-[10px] mr-auto mb-[4px]">ゲージ：1.25</p>
                                        <p className="h-[12px] text-[10px] mr-auto">テンション：40</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <hr className="w-[320px] border-sub-green mb-2 mx-auto" />
                            <div className="flex justify-end mr-6">
                              <span className="text-[10px] pr-1">自分に合っているか</span>
                              <span className="inline-block w-[104px] h-4 border mr-2"></span>
                              <span className="inline-block border-r-2 border-sub-green mr-1"></span>
                              <span className="text-[10px]">4.5</span>
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

export default ReviewList;
