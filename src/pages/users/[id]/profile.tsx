import type { NextPage } from "next";
import type { User } from "@/context/AuthContext";
import type {
  Frequency,
  PlayStyle,
  GripForm,
  FavaritShot,
  WeakShot,
  Age,
  Gender,
  Height,
  Physique
} from "./edit/tennis_profile";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import Link from "next/link";
import axios from "@/lib/axios";
import { Router, useRouter } from "next/router";

export type Maker = {
  id: number,
  name_ja: string,
  name_en: string,
  created_at: string,
  updated_at: string
}

export type RacketImage = {
  id: number,
  file_path: string,
  title: string,
  created_at: string,
  updated_at: string,
  maker_id: number,
  maker: Maker
}

export type Racket = {
  id: number,
  name_ja: string,
  name_en: string,
  maker_id: number,
  image_id: number,
  need_posting_image: number,
  created_at: string,
  updated_at: string,
  maker: Maker,
  racket_image: RacketImage
}

export type TennisProfile = {
  id: number,
  user_id: number,
  my_racket_id?: number,
  experience_period: number,
  frequency: Frequency,
  play_style: PlayStyle,
  grip_form: GripForm,
  favarit_shot: FavaritShot,
  weak_shot: WeakShot,
  age: Age,
  gender: Gender,
  height: Height,
  physique: Physique,
  racket: Racket,
  user: User
}

const UserProfile: NextPage = () => {
  const router = useRouter();

  const { isAuth, user } = useContext(AuthContext);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  const [tennisProfile, setTennisProfile] = useState<TennisProfile>();

  useEffect(() => {
    if (user.id) {
      const getTennisProfile = async () => {
        await axios.get(`api/tennis_profiles/user/${user.id}`).then(res => {
          setTennisProfile(res.data);
        })
      }

      getTennisProfile();
    } else {
      router.push('/reviews');
    }
  }, [])

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            {/* <h1>プロフィールページ</h1> */}
            <div className="container mx-auto">
              <div className="w-80 mt-6  mx-auto flex flex-col md:flex-row md:justify-center md:mt-[48px] md:w-[704px]">
                <div className="w-[320px] md:mr-[32px]">
                  <h2 className="text-xl">基本プロフィール</h2>
                  <hr className=" border-sub-green mb-6" />

                  <div className="w-16 mx-auto mb-4">
                    <div className="w-[64px] h-[64px] rounded-full overflow-hidden mb-2">
                      {user.file_path
                        ? <img src={`${baseImagePath}${user.file_path}`} width="64px" height="64px" alt="ユーザープロフィール画像" className="w-[64px] md:w-[80px] h-[64px] md:h-[80px]" />
                        : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="" />
                      }
                    </div>
                    <div className="w-8 h-1 bg-sub-green mx-auto"></div>
                  </div>

                  <hr />
                  <p className=" py-1">ユーザー名：{user.name}</p>

                  <hr />
                  <p className=" py-1 mb-4">メールアドレス：{user.email}</p>

                  <div className=" flex justify-end mb-14">
                    <Link href={`/users/${user.id}/edit/base_profile`}>
                      <button className="text-white text-[14px] w-[160px] h-8 rounded  bg-sub-green">基本プロフィール変更</button>
                    </Link>
                  </div>
                </div>

                <div className="w-[320px] md:ml-[32px]">
                  <h2 className="text-xl">テニスプロフィール</h2>
                  <hr className=" border-sub-green mb-4" />

                  <div className="flex flex-wrap justify-between mb-8">
                    <p className="mb-2 basis-full">使用ラケット</p>

                    <div className="w-28 h-40 bg-faint-green">
                      { tennisProfile?.racket?.racket_image.file_path
                        ? <img src={`${baseImagePath}${tennisProfile.racket.racket_image.file_path}`} alt="ラケット画像" className="w-[120px] h-[160px]" />
                        : <img src={`${baseImagePath}images/rackets/default_racket_image.png`} alt="ラケット画像" className="w-[120px] h-[160px]" />
                      }
                    </div>
                    
                    <div className="w-44 flex flex-col">
                      <span className="inline-block pl-2 text-xs mb-2">{tennisProfile?.racket ? tennisProfile?.racket.maker.name_en : ''}</span>
                      <p className="pl-2 leading-[18px] mb-4">{tennisProfile?.racket ? tennisProfile?.racket.name_ja : '未選択'}</p>
                      <hr className="border-sub-green" />
                    </div>
                  </div>

                  <hr />
                  <p className="py-1">テニス歴：{tennisProfile?.experience_period}</p>

                  <hr />
                  <p className="py-1">テニス頻度：{tennisProfile?.frequency}</p>

                  <hr />
                  <p className="py-1">プレースタイル：{tennisProfile?.play_style}</p>

                  <hr />
                  <p className="py-1">グリップ：{tennisProfile?.grip_form}</p>

                  <hr />
                  <p className="py-1">好きなショット：{tennisProfile?.favarit_shot}</p>

                  <hr />
                  <p className="py-1">苦手なショット：{tennisProfile?.weak_shot}</p>

                  <hr />
                  <p className="py-1">年齢：{tennisProfile?.age}</p>

                  <hr />
                  <p className="py-1">背丈：{tennisProfile?.height}</p>

                  <hr />
                  <p className="py-1 mb-4">体格：{tennisProfile?.physique}</p>

                  <div className=" flex justify-end mb-14">
                    <Link href={`/users/${user.id}/edit/tennis_profile`}>
                      <button className="text-white text-[14px] w-[160px] h-8 rounded  bg-sub-green">テニスプロフィール変更</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default UserProfile;
