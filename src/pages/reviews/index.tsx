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
import GutSearchModal from "@/components/GutSearchModal";
import RacketSearchModal from "@/components/RacketSearchModal";
import { ReviewContext } from "@/context/ReviewContext";
import { usePathHistory } from "@/context/HistoryContext";

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

  const [, lastBeforePath] = usePathHistory();

  const { isAuth, user, setUser, setIsAuth } = useContext(AuthContext);

  const [makers, setMakers] = useState<Maker[]>();

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/';

  const {
    reviewsPaginator,
    setReviewsPaginator,
    reviews,
    setReviews,
    searchedGuts,
    setSearchedGuts,
    searchedRackets,
    setSearchedRackets,

    matchRate,
    setMatchRate,
    pysicalDurability,
    setPysicalDurability,
    performanceDurability,
    setPerformanceDurability,

    stringingWay,
    setStringingWay,
    mainGut,
    setMainGut,
    crossGut,
    setCrossGut,
    racket,
    setRacket,

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
    setExperiencePeriod,
    setFrequency,
    setPlayStyle,
    setGripForm,
    setFavaritShot,
    setWeakShot,
    setAge,
    setGender,
    setHeight,
    setPhysique,
  } = useContext(ReviewContext)
  console.log('experiencePeriod', experiencePeriod)

  const {
    // form、input変更メソッド関連
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

  const [witchSelectingGut, setWitchSelectingGut] = useState<string>('');
  console.log('witchSelectingGut', witchSelectingGut)

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
      const getMakerList = async () => {
        await axios.get('api/makers').then(res => {
          setMakers(res.data);
        })
      }

      getMakerList();

      let isVisitingByHistoryBack = router.asPath === lastBeforePath;

      if (!reviews || !isVisitingByHistoryBack) {
        getReviewsList();

        allSearchStateReset();

        setSearchedGuts(undefined)
        setSearchedRackets(undefined)
      }
    } else {
      router.push('/users/login');
    }
  }, [])

  //モーダルの開閉に関するstate
  const [reviewSearchModalVisibility, setReviewSearchModalVisibility] = useState<boolean>(false);

  const [reviewSearchModalVisibilityClassName, setReviewSearchModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  const [gutSearchModalVisibility, setGutSearchModalVisibility] = useState<boolean>(false);

  const [racketSearchModalVisibility, setRacketSearchModalVisibility] = useState<boolean>(false);

  // review検索モーダル開閉とその時の縦スクロールの挙動を考慮している
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
  }, [reviewSearchModalVisibility, gutSearchModalVisibility])

  //モーダルの開閉
  const closeReviewSearchModal = () => {
    setReviewSearchModalVisibility(false);
    setReviewSearchModalVisibilityClassName('opacity-0 scale-0')
  }

  const openReviewSearchModal = () => {
    setReviewSearchModalVisibility(true);
    setReviewSearchModalVisibilityClassName('opacity-100 scale-100')
  }

  const closeGutSearchModalHandler = () => {
    setWitchSelectingGut('');
  }

  // gut検索モーダルでgutを選んだ際、mainGut,crossGutで分けて値をstateにセットさせたかったため、
  // 異なるopenメソッドでwitchSelectingGutを扱うようにしてある
  const openMainGutSearchModal = () => {
    setGutSearchModalVisibility(true);
    setWitchSelectingGut('main');
    console.log('cliked');
  }

  const openCrossGutSearchModal = () => {
    setGutSearchModalVisibility(true);
    setWitchSelectingGut('cross');
  }

  const selectGutHandler = (gut: Gut) => {
    console.log('gut', gut)
    if (witchSelectingGut === 'main') {
      setMainGut(gut);
    } else if (witchSelectingGut === 'cross') {
      setCrossGut(gut);
    }

    setWitchSelectingGut('');
  }

  // racket検索モーダル関連
  const closeRacketSearchModalHandler = () => { }

  const openRacketSearchModal = () => {
    setRacketSearchModalVisibility(true);
  }

  const selectRacketHandler = (racket: Racket) => {
    setRacket(racket);
  }

  //inputの制御関数群
  const onChangeInputStringingWay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStringingWay(e.target.value);
    setCrossGut(undefined);
  }

  const searchReviews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios.get('api/gut_reviews/search', {
      params: {
        match_rate: matchRate,
        pysical_durability: pysicalDurability,
        performance_durability: performanceDurability,
        search_range_type: 'or_more',
        // search_range_type: 'or_less',
        racket_id: racket?.id,
        stringing_way: (stringingWay && stringingWay !== '未設定') ? stringingWay : undefined,
        main_gut_id: mainGut?.id,
        cross_gut_id: crossGut?.id,

        user_height: (height && height !== '未設定') ? height : undefined,
        user_age: (age && age !== '未設定') ? age : undefined,
        experience_period: experiencePeriod,
        gender: (gender && gender !== '未設定') ? gender : undefined,
        grip_form: (gripForm && gripForm !== '未設定') ? gripForm : undefined,
        physique: (physique && physique !== '未設定') ? physique : undefined,
        frequency: (frequency && frequency !== '未設定') ? frequency : undefined,
        play_style: (playStyle && playStyle !== '未設定') ? playStyle : undefined,
        favarit_shot: (favaritShot && favaritShot !== '未設定') ? favaritShot : undefined,
        weak_shot: (weakShot && weakShot !== '未設定') ? weakShot : undefined,
      }
    }).then((res) => {
      closeReviewSearchModal();

      setReviewsPaginator(res.data)

      setReviews(res.data.data);

      console.log('検索完了しました');
    }).catch(e => {
      console.log(e);
    })
  }

  const allSearchStateReset = () => {
    resetSearchStateOfEvaluations();
    resetSearchStateOfTools();
    resetSearchStateOfUserStatus();

    getReviewsList();
    // closeReviewSearchModal();
  }

  const resetSearchStateOfEvaluations = () => {
    setMatchRate(1);
    setPysicalDurability(1);
    setPerformanceDurability(1);
  }

  const resetSearchStateOfTools = () => {
    setStringingWay('未設定');
    setRacket(undefined);
    setMainGut(undefined);
    setCrossGut(undefined);
  }

  const resetSearchStateOfUserStatus = () => {
    setExperiencePeriod(undefined);
    setFrequency('未設定');
    setPlayStyle('未設定');
    setGripForm('未設定');
    setFavaritShot('未設定');
    setWeakShot('未設定');
    setAge('未設定');
    setGender('未設定');
    setHeight('未設定');
    setPhysique('未設定');
  }

  const resetExperiencePeriod = () => {
    setExperiencePeriod(undefined);
  }


  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
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
                  <div onClick={closeReviewSearchModal} className="self-end hover:cursor-pointer mb-2 ">
                    <IoClose size={48} />
                  </div>

                  <div className="flex justify-end w-[100%] max-w-[320px] mb-4 md:max-w-[784px] md:mx-auto md:justify-start">
                    <button
                      onClick={allSearchStateReset}
                      className="text-white text-[14px] w-[120px] h-6 rounded  bg-sub-green md:w-[104px] md:h-8"
                    >全てリセット</button>
                  </div>

                  <form action="" onSubmit={searchReviews} className="flex flex-col mb-[24px] md:flex-row md:justify-center md:gap-x-[48px] md:flex-wrap md:mb-[40px]">
                    {/* section-two */}
                    <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[360px]">
                      <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                        <SubHeading text='評価' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                      </div>


                      {/* 評価値 */}
                      <div className="w-[320px] mb-6">
                        <p className="text-[12px] text-right mb-1">※ 評価値以上で検索されます</p>

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
                          className="border border-gray-300 rounded w-[160px] h-10 p-2 focus:outline-sub-green"
                        >
                          <option value="未設定" >未設定</option>
                          <option value="single" >単張り</option>
                          <option value="hybrid" >ハイブリッド</option>
                        </select>
                      </div>

                      <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                        <SubHeading text='ストリング' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[80px] md:max-w-[96px]" />
                      </div>

                      <div className="mb-4">
                        {stringingWay === 'hybrid' && <p className="text-[14px] h-[16px] mb-2 leading-[16px] md:text-[16px] md:h-[18px]">メイン</p>}

                        <SelectedToolWithoutImage
                          tool={mainGut}
                          type='gut'
                          selectBtnVisible={true}
                          btnText="選ぶ"
                          btnClickHandler={openMainGutSearchModal}
                        />
                      </div>

                      {stringingWay === 'hybrid' && (
                        <>
                          <div className="">
                            <p className="text-[14px] h-[16px] mb-2 leading-[16px] md:text-[16px] md:h-[18px]">クロス</p>

                            <SelectedToolWithoutImage
                              tool={crossGut}
                              type='gut'
                              selectBtnVisible={true}
                              btnText="選ぶ"
                              btnClickHandler={openCrossGutSearchModal}
                            />
                          </div>
                        </>
                      )}

                      <div className="w-[100%] max-w-[320px] mb-4 mt-6 md:max-w-[360px]">
                        <SubHeading text='ラケット' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[80px] md:max-w-[96px]" />
                      </div>

                      <div className="mb-10">
                        <SelectedToolWithoutImage
                          tool={racket}
                          type='racket'
                          selectBtnVisible={true}
                          btnText="選ぶ"
                          btnClickHandler={openRacketSearchModal}
                        />
                      </div>
                    </div>

                    {/* section-two */}
                    {/* ユーザーステータスでの検索項目 */}
                    <div className="">
                      <div className="w-[100%] max-w-[320px] mb-4 md:mt-0 md:max-w-[360px]">
                        <SubHeading text='ユーザーステータス' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                      </div>

                      {/* <div className="flex flex-wrap mb-6 w-[100%] max-w-[320px] md:max-w-[360px]"> */}
                      <div className="flex flex-wrap mb-4 w-[100%] max-w-[320px] md:max-w-[360px]">
                        <label
                          htmlFor="experience_period"
                          className="block text-[14px] h-[16px] mb-1 basis-[320px] md:text-[16px] md:h-[18px] md:mb-2"
                        >テニス歴</label>

                        <input
                          type="number"
                          name="experience_period"
                          onChange={(e) => onChangeExperiencePeriod(e, setExperiencePeriod)}
                          min="0"
                          max="100"
                          // value={experiencePeriod === undefined ? '' : experiencePeriod}
                          // defaultValue={experiencePeriod === undefined ? '' : experiencePeriod}
                          // defaultValue={experiencePeriod ? experiencePeriod : ''}
                          value={experiencePeriod ? experiencePeriod : ''}
                          className="border border-gray-300 rounded w-40 h-10 p-2 focus:outline-sub-green"
                        />
                        <span className="ml-4 h-10 leading-10">年</span>

                        <button
                          type="button"
                          onClick={resetExperiencePeriod}
                          className="text-white text-[14px] w-[80px] h-6 rounded ml-auto bg-sub-green md:w-[104px] md:h-8"
                        >年リセット</button>
                      </div>

                      <div className="mb-4">
                        <SelectBox
                          labelText="テニス頻度"
                          type="frequency"
                          onChangeHandler={onChangeFrequency}
                          // onChangeHandler={(e) => onChangeFrequency(e, setFrequency)}
                          setState={setFrequency}
                          optionValues={frequencys}
                          value={frequency}
                          className="w-80 md:w-[360px] h-10"
                        />
                      </div>

                      <div className="mb-4">
                        <SelectBox
                          labelText="プレースタイル"
                          type="play_style"
                          onChangeHandler={onChangePlayStyle}
                          setState={setPlayStyle}
                          optionValues={playStyles}
                          value={playStyle}
                          className="w-80 md:w-[360px] h-10"
                        />
                      </div>

                      <div className="mb-4">
                        <SelectBox
                          labelText="グリップの握り方"
                          type="grip_form"
                          onChangeHandler={onChangeGripForm}
                          setState={setGripForm}
                          optionValues={gripForms}
                          value={gripForm}
                          className="w-80 md:w-[360px] h-10"
                        />
                      </div>

                      <div className="mb-4">
                        <SelectBox
                          labelText="好きなショット"
                          type="favarit_shot"
                          onChangeHandler={onChangeFavaritShot}
                          setState={setFavaritShot}
                          optionValues={favaritShots}
                          value={favaritShot}
                          className="w-80 md:w-[360px] h-10"
                        />
                      </div>

                      <div className="mb-4">
                        <SelectBox
                          labelText="苦手なショット"
                          type="weak_shot"
                          onChangeHandler={onChangeWeakShot}
                          setState={setWeakShot}
                          optionValues={weakShots}
                          value={weakShot}
                          className="w-80 md:w-[360px] h-10"
                        />
                      </div>

                      <div className="mb-4">
                        <SelectBox
                          labelText="年齢"
                          type="age"
                          onChangeHandler={onChangeAge}
                          setState={setAge}
                          optionValues={ages}
                          value={age}
                          className="w-80 md:w-[360px] h-10"
                        />
                      </div>

                      <div className="mb-4">
                        <SelectBox
                          labelText="性別"
                          type="gender"
                          onChangeHandler={onChangeGender}
                          setState={setGender}
                          optionValues={genders}
                          value={gender}
                          className="w-80 md:w-[360px] h-10"
                        />
                      </div>

                      <div className="mb-4">
                        <SelectBox
                          labelText="背丈"
                          type="height"
                          onChangeHandler={onChangeHeight}
                          setState={setHeight}
                          optionValues={heights}
                          value={height}
                          className="w-80 md:w-[360px] h-10"
                        />
                      </div>

                      <div className="mb-4">
                        <SelectBox
                          labelText="体格"
                          type="physique"
                          onChangeHandler={onChangePhysique}
                          setState={setPhysique}
                          optionValues={physiques}
                          value={physique}
                          className="w-80 md:w-[360px] h-10"
                        />
                      </div>
                    </div>


                    <div className="flex justify-center md:justify-start sticky md:self-end bottom-8 z-40">
                      <button type="submit" className="text-white font-bold text-[14px] w-[320px] h-8 rounded  bg-sub-green md:text-[16px] md:h-[40px] md:w-[280px]">検索する</button>
                    </div>
                  </form>

                </div>
              </div>

              <GutSearchModal
                modalVisibility={gutSearchModalVisibility}
                setModalVisibility={setGutSearchModalVisibility}
                makers={makers}
                closeModalHandler={closeGutSearchModalHandler}
                selectGutHandler={selectGutHandler}
                showingResult={true}
                searchedGuts={searchedGuts}
                setSearchedGuts={setSearchedGuts}
                zIndexClassName="z-50"
              />

              <RacketSearchModal
                modalVisibility={racketSearchModalVisibility}
                setModalVisibility={setRacketSearchModalVisibility}
                makers={makers}
                closeModalHandler={closeRacketSearchModalHandler}
                selectRacketHandler={selectRacketHandler}
                showingResult={true}
                searchedRackets={searchedRackets}
                setSearchedRackets={setSearchedRackets}
                zIndexClassName="z-50"
              />

            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default ReviewList;
