import { Maker, Racket, RacketImage } from "../users/[id]/profile";
import type { User } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import AuthCheck from "@/components/AuthCheck";
import axios from "@/lib/axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Pagination, { Paginator } from "@/components/Pagination";
import BarGraph, { EvaluationVal } from "@/components/BarGraph";
import { IoClose } from "react-icons/io5";
import EvaluationRangeItem from "@/components/EvaluationRangeItem";
import SubHeading from "@/components/SubHeading";
import TextUnderBar from "@/components/TextUnderBar";
import SelectedToolWithoutImage from "@/components/SelectedToolWithoutImage";
import useTennisProfileForm from "@/hooks/useTennisProfileForm";
import SelectBox from "@/components/SelectBox";

type GutImage = {
  id: number,
  file_path: string,
  title: string,
  created_at: string,
  updated_at: string
}

export type Gut = {
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

export type MyEquipment = {
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
  change_gut_date: undefined | null | string,
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
  user_id: number,
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

  const [reviewsPaginator, setReviewsPaginator] = useState<Paginator<Review>>();

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/';

  const {
    // state値
    experiencePeriod,
    frequency,
    playStyle,
    gripForm,
    favaritShot,
    weakShot,
    age,
    gender,
    height,
    physique,

    // setState関数
    onChangeExperiencePeriod,
    onChangeFrequency,
    onChangePlayStyle,
    onChangeGripForm,
    onChangeFavaritShot,
    onChangeWeakShot,
    onChangeAge,
    onChangeGender,
    onChangeHeight,
    onChangePhysique,

    // リテラル型のユニオンにある値を配列で表したもの
    frequencys,
    playStyles,
    gripForms,
    favaritShots,
    weakShots,
    ages,
    genders,
    heights,
    physiques,
  } = useTennisProfileForm();
  console.log('experiencePeriod', experiencePeriod)
  console.log('frequency', frequency)
  console.log('playStyle', playStyle)
  console.log('favaritShot', favaritShot)
  console.log('gripForm', gripForm)
  console.log('age', age)
  console.log('weakShot', weakShot)
  console.log('gender', gender)
  console.log('height', height)
  console.log('physique', physique)

  //ページネーションを考慮したreview一覧データの取得関数
  const getReviewsList = async (url: string = 'api/gut_reviews') => {
    await axios.get(url).then(res => {
      console.log('res', res.data)
      setReviewsPaginator(res.data)
      setReviews(res.data.data);
    })
  }

  useEffect(() => {
    if (user.id) {
      getReviewsList();
    } else {
      router.push('/users/login');
    }
  }, [])

  // 評価に関するstate
  const [matchRate, setMatchRate] = useState<number>(3);
  console.log('matchRate', matchRate)
  const [pysicalDurability, setPysicalDurability] = useState<number>(3);
  console.log('pysicalDurability', pysicalDurability)
  const [performanceDurability, setPerformanceDurability] = useState<number>(3);
  console.log('performanceDurability', performanceDurability)

  //モーダルの開閉に関するstate
  const [reviewSearchModalVisibility, setReviewSearchModalVisibility] = useState<boolean>(false);

  const [reviewSearchModalVisibilityClassName, setReviewSearchModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  // gut検索モーダル開閉とその時の縦スクロールの挙動を考慮している
  useEffect(() => {
    if (reviewSearchModalVisibility) {
      setReviewSearchModalVisibilityClassName('opacity-100 scale-100')
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      setReviewSearchModalVisibilityClassName('opacity-0 scale-0');
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [reviewSearchModalVisibility])

  //モーダルの開閉
  const closeReviewSearchModal = () => {
    setReviewSearchModalVisibility(false);
    setReviewSearchModalVisibilityClassName('opacity-0 scale-0')
  }

  const openReviewSearchModal = () => {
    setReviewSearchModalVisibility(true);
    setReviewSearchModalVisibilityClassName('opacity-100 scale-100')
  }

  const [stringingWay, setStringingWay] = useState<string>('single');
  console.log('stringingWay', stringingWay)

  //inputの制御関数群
  const onChangeInputStringingWay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStringingWay(e.target.value);
    // setCrossGut(undefined);
  }

  const searchReview = () => {

  }

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            {/* <div className="container mx-auto relative"> */}
            <div className="container mx-auto">
              <div className="mb-6 mt-6 italic md:mb-[32px] md:mt-[32px]">
                <h1 className="text-center text-[20px] md:text-[32px]">Reviews</h1>
              </div>

              <div className="flex justify-center mb-6 md:w-[784px] md:mx-auto md:justify-end">
                <button
                  onClick={openReviewSearchModal}
                  className="text-white text-[14px] w-[264px] h-8 rounded  bg-sub-green md:w-[104px]"
                >検索</button>
              </div>
              
              <div className="flex flex-col items-center md:flex-row md:flex-wrap md:w-[784px] md:justify-between md:mx-auto">
                {reviews && (
                  reviews.map(review => {
                    return (
                      <>
                        <Link href={`/reviews/${review.id}/review`}>
                          <div key={review.id} className="w-[360px] h-[280px] border border-gray-400 rounded mb-6 flex flex-col justify-around py-4 hover:cursor-pointer">
                            {/* 単張りのカード */}
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

                            {/* ハイブリッド張りのカード */}
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

                              <BarGraph
                                evaluationVal={review.match_rate as EvaluationVal}
                                areaSize="sp"
                                graphHeight="h-[16px] md:h-[18px]"
                              />

                              <span className="inline-block border-r-2 border-sub-green mr-1 ml-2"></span>
                              <span className="text-[10px]">{review.match_rate}</span>
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
                paginator={reviewsPaginator}
                paginate={getReviewsList}
                className="mt-[32px] md:mt-[48px]"
              />

              {/* review検索モーダル */}
              <div className={`bg-gray-300 w-screen h-screen fixed top-0 left-0 z-30 ${reviewSearchModalVisibilityClassName} duration-[400ms] pt-[24px] overflow-y-scroll`}>
                <div className="flex flex-col items-center w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">
                  <div onClick={closeReviewSearchModal} className="self-end hover:cursor-pointer md:mr-[39px]">
                    <IoClose size={48} />
                  </div>

                  {/* <form action="" onSubmit={searchGuts} className="mb-[24px] md:flex md:mb-[40px]"> */}
                  {/* <form action="" onSubmit={searchReview} className="mb-[24px] md:flex md:mb-[40px]"> */}
                  <form action="" onSubmit={searchReview} className="flex flex-col mb-[24px] md:flex-row md:justify-center md:gap-x-[48px] md:flex-wrap md:mb-[40px]">
                    <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[360px]">
                      <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[360px]">
                        <SubHeading text='評価' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                      </div>

                      {/* 評価値 */}
                      <div className="w-[320px]">
                        <EvaluationRangeItem
                          labelText="自分に合っているか"
                          scale={true}
                          onChangeInputRangeHnadler={(e) => { setMatchRate(Number(e.target.value)) }}
                          valueState={matchRate}
                          className="mb-6 md:mb-2"
                          trackColor="[&::-webkit-slider-runnable-track]:bg-white [&::-moz-range-track]:bg-white"
                        />

                        <EvaluationRangeItem
                          labelText="切れにくさ"
                          scale={false}
                          onChangeInputRangeHnadler={(e) => { setPysicalDurability(Number(e.target.value)) }}
                          valueState={pysicalDurability}
                          className="mb-[41px] md:mb-[36px]"
                          trackColor="[&::-webkit-slider-runnable-track]:bg-white [&::-moz-range-track]:bg-white"
                        />

                        <EvaluationRangeItem
                          labelText="打球感の持続"
                          scale={false}
                          onChangeInputRangeHnadler={(e) => { setPerformanceDurability(Number(e.target.value)) }}
                          valueState={performanceDurability}
                          className="mb-10"
                          trackColor="[&::-webkit-slider-runnable-track]:bg-white [&::-moz-range-track]:bg-white"
                        />
                      </div>

                      <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                        <SubHeading text='装備構成' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                      </div>

                      {/* 張り方選択 */}
                      <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                        <label htmlFor="stringing_way" className="block text-[14px] md:text-[16px]">ストリングの張り方</label>

                        <select
                          name="stringing_way"
                          id="stringing_way"
                          value={stringingWay}
                          onChange={onChangeInputStringingWay}
                          // disabled={!!myEquipment}
                          className="border border-gray-300 rounded w-[160px] h-10 p-2 focus:outline-sub-green"
                        >
                          <option value="single" >単張り</option>
                          <option value="hybrid" >ハイブリッド</option>
                        </select>

                        {/* {errors.stringing_way.length !== 0 &&
                          errors.stringing_way.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        } */}
                      </div>

                      <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                        <SubHeading text='ストリング' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[80px] md:max-w-[96px]" />
                      </div>

                      <div className="mb-4">
                        {stringingWay === 'hybrid' && <p className="text-[14px] h-[16px] mb-2 leading-[16px] md:text-[16px] md:h-[18px]">クロス</p>}

                        <SelectedToolWithoutImage
                          // tool={}
                          type='gut'
                          selectBtnVisible={true}
                          btnText="選ぶ"
                        // btnClickHandler={}
                        />
                      </div>

                      {stringingWay === 'hybrid' && (
                        <>
                          <div className="">
                            <p className="text-[14px] h-[16px] mb-2 leading-[16px] md:text-[16px] md:h-[18px]">メイン</p>

                            <SelectedToolWithoutImage
                              // tool={}
                              type='gut'
                              selectBtnVisible={true}
                              btnText="選ぶ"
                            // btnClickHandler={}
                            />
                          </div>
                        </>
                      )}

                      <div className="w-[100%] max-w-[320px] mb-4 mt-6 md:max-w-[360px]">
                        <SubHeading text='ラケット' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[80px] md:max-w-[96px]" />
                      </div>

                      <div className="mb-4">
                        <SelectedToolWithoutImage
                          // tool={}
                          type='racket'
                          selectBtnVisible={true}
                          btnText="選ぶ"
                        // btnClickHandler={}
                        />
                      </div>
                    </div>

                    {/* section-two */}
                    {/* ユーザーステータスでの検索項目 */}
                    <div className="">
                      <div className="w-[100%] max-w-[320px] mb-4 mt-[40px] md:mt-0 md:max-w-[360px]">
                        <SubHeading text='ユーザーステータス' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="experience_period"
                          className="block text-[14px] h-[16px] mb-1 md:text-[16px] md:h-[18px] md:mb-2"
                        >テニス歴</label>

                        <input
                          type="number"
                          name="experience_period"
                          onChange={onChangeExperiencePeriod}
                          min="0"
                          max="100"
                          defaultValue={experiencePeriod}
                          className="border border-gray-300 rounded w-40 h-10 p-2 focus:outline-sub-green"
                        />
                        <span className="ml-4">年</span>

                        {/* {errors.experience_period.length !== 0 &&
                        errors.experience_period.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>

                      <div className=" mb-8">
                        <SelectBox
                          labelText="テニス頻度"
                          type="frequency"
                          onChangeHandler={onChangeFrequency}
                          optionValues={frequencys}
                          className="w-80 md:w-[360px] h-10"
                        />

                        {/* {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>

                      <div className=" mb-8">
                        <SelectBox
                          labelText="プレースタイル"
                          type="play_style"
                          onChangeHandler={onChangePlayStyle}
                          optionValues={playStyles}
                          className="w-80 md:w-[360px] h-10"
                        />

                        {/* {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>

                      <div className=" mb-8">
                        <SelectBox
                          labelText="グリップの握り方"
                          type="grip_form"
                          onChangeHandler={onChangeGripForm}
                          optionValues={gripForms}
                          className="w-80 md:w-[360px] h-10"
                        />

                        {/* {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>

                      <div className=" mb-8">
                        <SelectBox
                          labelText="好きなショット"
                          type="favarit_shot"
                          onChangeHandler={onChangeFavaritShot}
                          optionValues={favaritShots}
                          className="w-80 md:w-[360px] h-10"
                        />

                        {/* {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>

                      <div className=" mb-8">
                        <SelectBox
                          labelText="苦手なショット"
                          type="weak_shot"
                          onChangeHandler={onChangeWeakShot}
                          optionValues={weakShots}
                          className="w-80 md:w-[360px] h-10"
                        />

                        {/* {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>

                      <div className=" mb-8">
                        <SelectBox
                          labelText="年齢"
                          type="age"
                          onChangeHandler={onChangeAge}
                          optionValues={ages}
                          className="w-80 md:w-[360px] h-10"
                        />

                        {/* {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>

                      <div className=" mb-8">
                        <SelectBox
                          labelText="性別"
                          type="gender"
                          onChangeHandler={onChangeGender}
                          optionValues={genders}
                          className="w-80 md:w-[360px] h-10"
                        />

                        {/* {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>

                      <div className=" mb-8">
                        <SelectBox
                          labelText="背丈"
                          type="height"
                          onChangeHandler={onChangeHeight}
                          optionValues={heights}
                          className="w-80 md:w-[360px] h-10"
                        />

                        {/* {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>

                      <div className=" mb-8">
                        <SelectBox
                          labelText="体格"
                          type="physique"
                          onChangeHandler={onChangePhysique}
                          optionValues={physiques}
                          className="w-80 md:w-[360px] h-10"
                        />

                        {/* {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                      </div>
                    </div>


                    <div className="flex justify-center md:justify-start sticky md:self-end bottom-8 z-40">
                      <button type="submit" className="text-white font-bold text-[14px] w-[320px] h-8 rounded  bg-sub-green md:text-[16px] md:h-[40px] md:w-[280px]">検索する</button>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default ReviewList;
