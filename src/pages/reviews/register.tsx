import type { NextPage } from "next";
import type { Maker, Racket, TennisProfile } from "../users/[id]/profile";
import type { Gut, MyEquipment, Review } from "../reviews";
import type { Age, Height } from "../users/[id]/edit/tennis_profile";

import axios from "@/lib/axios";
import Cookies from "js-cookie";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import SubHeading from "@/components/SubHeading";
import TextUnderBar from "@/components/TextUnderBar";
import { IoClose } from "react-icons/io5";
import Pagination, { Paginator } from "@/components/Pagination";
import EvaluationRangeItem from "@/components/EvaluationRangeItem";
import MyEquipmentCard from "@/components/MyEquipmentCard";
import GutSearchModal from "@/components/GutSearchModal";
import RacketSearchModal from "@/components/RacketSearchModal";

import { getToday } from "@/modules/getToday";
import RacketRegisterModal from "@/components/RacketRegisterModal";
import { RacketSeries } from "@/types/global";

type PostingGutReviewData = {
  match_rate: number | undefined,
  pysical_durability: number,
  performance_durability: number,
  review: string,
  equipment_id: number | null,
  need_creating_my_equipment: boolean,

  user_id?: number,
  user_height?: Height,
  user_age?: Age,
  experience_period?: number,
  stringing_way?: string,
  main_gut_id?: number,
  cross_gut_id?: number,
  main_gut_guage?: number,
  cross_gut_guage?: number,
  main_gut_tension?: number,
  cross_gut_tension?: number,
  racket_id?: number,
  new_gut_date?: string,
  change_gut_date?: string | null,
  comment?: string,
}

const GutReviewRegister: NextPage = () => {
  const router = useRouter();

  const { isAuth, user, isAuthAdmin } = useContext(AuthContext);

  const today: string = getToday();

  const [userTennisProfile, setUserTennisProfile] = useState<TennisProfile>();

  //my_equipmentの登録に使うstate群
  const [stringingWay, setStringingWay] = useState<string>('single');

  const [mainGut, setMainGut] = useState<Gut>();

  const [crossGut, setCrossGut] = useState<Gut>();

  const [racket, setRacket] = useState<Racket>();

  //要素の表示などに使用するstate群
  const [myEquipment, setMyEquipment] = useState<MyEquipment>();
  console.log('myEquipment', myEquipment)

  const [makers, setMakers] = useState<Maker[]>();

  const [witchSelectingGut, setWitchSelectingGut] = useState<string>('');

  const [racketSeries, setRacketSeries] = useState<RacketSeries[]>();
  console.log('racketSeries', racketSeries)

  // inputに関するstate
  const [inputMainGutGuage, setInputMainGutGuage] = useState<number>(1.25);

  const [inputCrossGutGuage, setInputCrossGutGuage] = useState<number>(1.25);

  const [inputMainGutTension, setInputMainGutTension] = useState<number>(50);

  const [inputMainCrossTension, setInputMainCrossTension] = useState<number>(50);

  const [inputNewGutDate, setInputNewGutDate] = useState<string>(today);

  //モーダルの開閉に関するstate
  const [gutSearchModalVisibility, setGutSearchModalVisibility] = useState<boolean>(false);

  const [racketSearchModalVisibility, setRacketSearchModalVisibility] = useState<boolean>(false);

  const [myEquipmentSearchModalVisibility, setMyEquipmentModalVisibility] = useState<boolean>(false);

  const [myEquipmentSearchModalVisibilityClassName, setMyEquipmentSearchModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  const [racketRegisterModalVisibility, setRacketRegisterModalVisibility] = useState<boolean>(false);

  //検索関連のstate
  const [inputGutSearchWord, setInputGutSearchWord] = useState<string>('');
  const [inputGutSearchMaker, setInputGutSearchMaker] = useState<number>();
  const [inputRacketSearchWord, setInputRacketSearchWord] = useState<string>('');
  const [inputRacketSearchMaker, setInputRacketSearchMaker] = useState<number>();

  const [searchedGuts, setSearchedGuts] = useState<Gut[]>();

  const [searchedRackets, setSearchedRackets] = useState<Racket[]>();

  const [searchedMyEquipments, setSearchedEquipments] = useState<MyEquipment[]>();

  const [myEquipmentsPaginator, setMyEquipmentsPaginator] = useState<Paginator<MyEquipment>>();

  // myEquipment検索state群
  const [inputMyEquipmentSearchWord, setInputMyEquipmentSearchWord] = useState<string>('');
  const [inputMyEquipmentSearchStringingWay, setInputMyEquipmentSearchStringingWay] = useState<string>('');
  const [inputMyEquipmentSearchDate, setInputMyEquipmentSearchDate] = useState<string>(today);
  const [inputMyEquipmentSearchDateRangeType, setInputMyEquipmentSearchDateRangeType] = useState<string>('or_less');

  // 評価に関するstate
  const [matchRate, setMatchRate] = useState<number>(3);
  const [pysicalDurability, setPysicalDurability] = useState<number>(3);
  const [performanceDurability, setPerformanceDurability] = useState<number>(3);
  const [reviewComment, setReviewComment] = useState<string>('');

  useEffect(() => {
    const getMakerList = async () => {
      await axios.get('api/makers').then(res => {
        setMakers(res.data);
      })
    }

    const getUserTennisProfile = async () => {
      await axios.get(`api/tennis_profiles/user/${user.id}`).then(res => {
        setUserTennisProfile(res.data);
      })
    }

    const getRacketSeries = async () => {
      await axios.get('api/racket_series').then(res => {
        setRacketSeries(res.data);
      })
    }

    getUserTennisProfile();
    getMakerList();
    getRacketSeries();
  }, [])

  // gut検索モーダル開閉とその時の縦スクロールの挙動を考慮している
  useEffect(() => {
    if (gutSearchModalVisibility) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [gutSearchModalVisibility])

  // racket検索モーダル開閉とその時の縦スクロールの挙動を考慮している
  useEffect(() => {
    if (racketSearchModalVisibility) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [racketSearchModalVisibility])

  // myEquipment検索モーダル開閉とその時の縦スクロールの挙動を考慮している
  useEffect(() => {
    if (myEquipmentSearchModalVisibility) {
      setMyEquipmentSearchModalVisibilityClassName('opacity-100 scale-100')
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      setMyEquipmentSearchModalVisibilityClassName('opacity-0 scale-0');
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [myEquipmentSearchModalVisibility])

  //inputの制御関数群
  const onChangeInputStringingWay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStringingWay(e.target.value);
    setCrossGut(undefined);
  }

  const onChangeInputSearchMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setInputRacketSearchMaker(undefined);
      return
    };

    setInputRacketSearchMaker(Number(e.target.value));
  }

  //モーダルの開閉
  const closeModal = () => {
    setGutSearchModalVisibility(false);
    setWitchSelectingGut('');
  }

  //gutを選んだ際、mainGut,crossGutで分けて値をstateにセットさせたかったためopenModalを分けてある
  const openMainGutSearchModal = () => {
    setGutSearchModalVisibility(true);
    setWitchSelectingGut('main');
  }

  const openCrossGutSearchModal = () => {
    setGutSearchModalVisibility(true);
    setWitchSelectingGut('cross');
  }

  //gutとは別でracket検索のモーダルが必要であり開閉の処理をgut検索のモーダルとは分離しておく必要があった
  const openRacketSearchModal = () => {
    setRacketSearchModalVisibility(true);
  }

  const closeRacketSearchModal = () => {
    setRacketSearchModalVisibility(false)
  }

  // my_equipment検索モーダル開閉
  const openMyEquipmentSearchModal = () => {
    setMyEquipmentModalVisibility(true);
    setMyEquipmentSearchModalVisibilityClassName('opacity-100 scale-100');
  }

  const closeMyEquipmentSearchModal = () => {
    setMyEquipmentModalVisibility(false)
    setMyEquipmentSearchModalVisibilityClassName('opacity-0 scale-0');
  }

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  //ページネーションを考慮した検索後myEquipment一覧データの取得
  const initialMyEquipmentSearchUrl = `api/my_equipments/user/${user.id}/search?several_words=${inputMyEquipmentSearchWord}&stringing_way=${inputMyEquipmentSearchStringingWay}&search_date=${inputMyEquipmentSearchDate}&date_range_type=${inputMyEquipmentSearchDateRangeType}`;
  const getSearchedMyEquipmentsList = async (url: string = initialMyEquipmentSearchUrl) => {
    await axios.get(url).then((res) => {
      setMyEquipmentsPaginator(res.data);

      setSearchedEquipments(res.data.data);
    })
  }

  //myEquipment検索
  const searchMyEquipments = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      getSearchedMyEquipmentsList();

      console.log('検索完了しました')
    } catch (e) {
      console.log(e);
    }
  }

  const selectGut = (gut: Gut) => {
    if (witchSelectingGut === 'main') {
      setMainGut(gut);
    } else if (witchSelectingGut === 'cross') {
      setCrossGut(gut);
    }

    closeModal();
  }

  const selectRacket = (racket: Racket) => {
    setRacket(racket)
    closeRacketSearchModal();
  }

  const selectMyEquipment = (myEquipment: MyEquipment) => {
    // 一つのmyEquipmentを選び、各stateに値をセット
    setMyEquipment(myEquipment)
    setStringingWay(myEquipment.stringing_way)
    setMainGut(myEquipment.main_gut)
    setCrossGut(myEquipment.cross_gut)
    setRacket(myEquipment.racket)
    setInputMainGutGuage(myEquipment.main_gut_guage)
    setInputCrossGutGuage(myEquipment.cross_gut_guage)
    setInputMainGutTension(myEquipment.main_gut_tension)
    setInputMainCrossTension(myEquipment.cross_gut_tension)

    closeMyEquipmentSearchModal();
  }

  const afterRegistringRacketHandler = (racket?: Racket) => {
    if(racket) {
      selectRacket(racket);
    }
  }

  type Errors = {
    user_id: string[],
    user_height: string[],
    user_age: string[],
    experience_period: string[],
    stringing_way: string[],
    main_gut_id: string[],
    cross_gut_id: string[],
    main_gut_guage: string[],
    cross_gut_guage: string[],
    main_gut_tension: string[],
    cross_gut_tension: string[],
    racket_id: string[],
    new_gut_date: string[],
    // change_gut_date: string[],
    // comment: string[],
    review: string[]
  }

  const initialErrorVals = {
    user_id: [],
    user_height: [],
    user_age: [],
    experience_period: [],
    stringing_way: [],
    main_gut_id: [],
    cross_gut_id: [],
    main_gut_guage: [],
    cross_gut_guage: [],
    main_gut_tension: [],
    cross_gut_tension: [],
    racket_id: [],
    new_gut_date: [],
    // change_gut_date: [],
    // comment: [],
    review: [],
  }

  const [errors, setErrors] = useState<Errors>(initialErrorVals);

  //review登録処理関連
  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const postGutReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let postingData: PostingGutReviewData = {
      match_rate: matchRate,
      pysical_durability: pysicalDurability,
      performance_durability: performanceDurability,
      review: reviewComment,
      equipment_id: myEquipment ? myEquipment.id : null,
      need_creating_my_equipment: myEquipment ? false : true,
    }

    // 新規でmyEquipmentの登録が必要な場合にpostingDataに必要項目を追加
    if (!myEquipment) {
      postingData.user_id = user.id;
      postingData.user_height = userTennisProfile?.height;
      postingData.user_age = userTennisProfile?.age;
      postingData.experience_period = userTennisProfile?.experience_period;
      postingData.stringing_way = stringingWay;
      postingData.main_gut_id = mainGut?.id;
      postingData.cross_gut_id = stringingWay === 'hybrid' && crossGut ? crossGut.id : mainGut?.id;
      postingData.main_gut_guage = inputMainGutGuage;
      postingData.cross_gut_guage = inputCrossGutGuage;
      postingData.main_gut_tension = inputMainGutTension;
      postingData.cross_gut_tension = inputMainCrossTension;
      postingData.racket_id = racket?.id;
      postingData.new_gut_date = inputNewGutDate;
      postingData.change_gut_date = null;
      postingData.comment = '';
    }

    console.log('postingData', postingData)

    await csrf();

    await axios.post('api/gut_reviews', postingData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(res => {
      console.log('レビューを投稿しました。');

      router.push('/reviews');
    }).catch((e) => {
      const newErrors = { ...initialErrorVals, ...e.response.data.errors };

      setErrors(newErrors);

      console.log('レビューを投稿に失敗しました');
    })
  }

  const resetState = () => {
    setMyEquipment(undefined);
    setStringingWay('single')
    setMainGut(undefined)
    setCrossGut(undefined)
    setRacket(undefined)
    setInputMainGutGuage(1.25)
    setInputCrossGutGuage(1.25)
    setInputMainGutTension(50)
    setInputMainCrossTension(50)
  }

  return (
    <>
      <AuthCheck>
        {(isAuth || isAuthAdmin) && (
          <>
            <div className="container mx-auto mb-6">
              <div className="text-center my-6 md:mb-[32px]">
                <PrimaryHeading text="Post Review" className="text-[18px] italic h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">

                <form
                  onSubmit={postGutReview}
                  className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:justify-between"
                >

                  {/* //section-one */}
                  <div className="md:w-[100%] md:max-w-[360px]">
                    <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                      <SubHeading text='装備構成' className="text-[16px] md:text-[18px] md:mb-2" />
                      <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                    </div>

                    <div className="flex justify-end">
                      {myEquipment
                        ? <button type="button" onClick={resetState} className="text-white font-bold text-[14px] w-[128px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">リセット</button>
                        : <button type="button" onClick={openMyEquipmentSearchModal} className="text-white font-bold text-[14px] w-[160px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">マイ装備から選択</button>
                      }
                    </div>

                    {/* ストリング関連 */}
                    <div>
                      <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                        <SubHeading text='ストリング' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[84px] md:max-w-[96px]" />
                      </div>

                      {/* 張り方選択 */}
                      <div className="w-[100%] max-w-[320px] mb-8 md:max-w-[360px]">
                        <label htmlFor="stringing_way" className="block text-[14px] md:text-[16px]">ストリングの張り方</label>

                        <select
                          name="stringing_way"
                          id="stringing_way"
                          value={stringingWay}
                          onChange={onChangeInputStringingWay}
                          disabled={!!myEquipment}
                          className="border border-gray-300 rounded w-[160px] h-10 p-2 focus:outline-sub-green"
                        >
                          <option value="single" >単張り</option>
                          <option value="hybrid" >ハイブリッド</option>
                        </select>

                        {errors.stringing_way.length !== 0 &&
                          errors.stringing_way.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        }
                      </div>

                      {/* ストリング選択セクション */}
                      <div>
                        <input type="hidden" name="main_gut_id" value={mainGut ? mainGut.id : undefined} />
                        <input type="hidden" name="cross_gut_id" value={crossGut ? crossGut.id : undefined} />

                        <p className="text-[14px] h-[16px] mb-[8px] leading-[16px] md:text-[16px] md:h-[18px]">使用ストリング</p>

                        {stringingWay === 'hybrid' && <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">メイン</p>}
                        <div className="mb-6">

                          <div className="flex md:w-[100%] md:max-w-[360px]">
                            <div className="w-[120px] mr-6">
                              {mainGut && mainGut.gut_image.file_path
                                ? <img src={`${baseImagePath}${mainGut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                                : <img src={`${baseImagePath}images/guts/default_gut_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                              }
                            </div>

                            <div className="w-[100%] max-w-[176px] md:max-w-[216px]">
                              <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">選択中</p>

                              <div className="border rounded py-[8px] mb-[16px] md:mb-[8px]">
                                <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-1">{mainGut ? mainGut.maker.name_en : ''}</p>
                                <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px] md:h-[20px]">{mainGut ? mainGut.name_ja : '未選択'}</p>
                              </div>

                              {!myEquipment && (
                                <>
                                  <div className="flex justify-end">
                                    <button type="button" onClick={openMainGutSearchModal} className="text-white font-bold text-[14px] w-[80px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">変更</button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {errors.main_gut_id.length !== 0 &&
                            errors.main_gut_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                          }
                        </div>

                        {/* ハイブリッド張りの時crossGutを表示 */}
                        {stringingWay === 'hybrid' && (
                          <>
                            <div className=" mb-6">

                              <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">クロス</p>

                              <div className="flex md:w-[100%] md:max-w-[360px]">
                                <div className="w-[120px] mr-6">
                                  {crossGut && crossGut.gut_image.file_path
                                    ? <img src={`${baseImagePath}${crossGut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                                    : <img src={`${baseImagePath}images/guts/default_gut_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                                  }
                                </div>

                                <div className="w-[100%] max-w-[176px] md:max-w-[216px]">
                                  <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">選択中</p>

                                  <div className="border rounded py-[8px] mb-[16px] md:mb-[8px]">
                                    <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-1">{crossGut ? crossGut.maker.name_ja : ''}</p>
                                    <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px] md:h-[20px]">{crossGut ? crossGut.name_ja : '未選択'}</p>
                                  </div>

                                  {!myEquipment && (
                                    <>
                                      <div className="flex justify-end">
                                        <button type="button" onClick={openCrossGutSearchModal} className="text-white font-bold text-[14px] w-[80px] h-[32px] rounded ml-auto  bg-sub-green  md:text-[16px]">変更</button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {errors.cross_gut_id.length !== 0 &&
                                errors.cross_gut_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                              }
                            </div>
                          </>
                        )}

                      </div>

                      {/* gut太さ選択 */}
                      <div className="mb-[24px]">
                        <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-[8px]">太さ（メイン / クロス）</p>
                        <div>
                          <input
                            type="number"
                            name="main_gut_guage"
                            step={0.01}
                            value={inputMainGutGuage}
                            min="1.05"
                            max="1.50"
                            disabled={!!myEquipment}
                            onChange={(e) => setInputMainGutGuage(Number(e.target.value))}
                            className="inline-block border border-gray-300 rounded w-[72px] h-10 p-2 focus:outline-sub-green mr-1"
                          />
                          <span className="inline-block text-[14px] h-[16px] leading-[16px] mr-[16px] md:text-[16px] md:h-[18px]">mm</span>
                          <span className="inline-block text-[16px] text-center h-[18px] leading-[16px] mr-[16px] w-[100%] max-w-[16px] md:text-[16px] md:h-[18px]">/</span>
                          <input
                            type="number"
                            name="cross_gut_guage"
                            step={0.01}
                            value={inputCrossGutGuage}
                            min="1.05"
                            max="1.50"
                            disabled={!!myEquipment}
                            onChange={(e) => setInputCrossGutGuage(Number(e.target.value))}
                            className="inline-block border border-gray-300 rounded w-[72px] h-10 p-2 focus:outline-sub-green mr-1"
                          />
                          <span className="inline-block text-[14px] h-[16px] leading-[16px] md:text-[16px] md:h-[18px]">mm</span>
                        </div>
                        {errors.main_gut_guage.length !== 0 &&
                          errors.main_gut_guage.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        }
                        {errors.cross_gut_guage.length !== 0 &&
                          errors.cross_gut_guage.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        }
                      </div>

                      {/* gutテンション選択 */}
                      <div className="mb-6">
                        <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-[8px]">テンション（メイン / クロス）</p>
                        <div>
                          <input
                            type="number"
                            name="main_gut_guage"
                            step={1}
                            value={inputMainGutTension}
                            min="1"
                            max="100"
                            disabled={!!myEquipment}
                            onChange={(e) => setInputMainGutTension(Number(e.target.value))}
                            className="inline-block border border-gray-300 rounded w-[64px] h-10 p-2 focus:outline-sub-green mr-1"
                          />
                          <span className="inline-block text-[16px] text-center h-[18px] mb-[4px] leading-[16px] mr-[4px] w-[100%] max-w-[16px] md:text-[16px] md:h-[18px]">/</span>
                          <input
                            type="number"
                            name="cross_gut_guage"
                            step={1}
                            value={inputMainCrossTension}
                            min="1"
                            max="100"
                            disabled={!!myEquipment}
                            onChange={(e) => setInputMainCrossTension(Number(e.target.value))}
                            className="inline-block border border-gray-300 rounded w-[64px] h-10 p-2 focus:outline-sub-green mr-1"
                          />
                          <span className="inline-block text-[14px] h-[16px] leading-[16px] md:text-[16px] md:h-[18px]">ポンド</span>
                        </div>
                        {errors.main_gut_tension.length !== 0 &&
                          errors.main_gut_tension.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        }
                        {errors.cross_gut_tension.length !== 0 &&
                          errors.cross_gut_tension.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        }
                      </div>
                    </div>

                    {/* ラケット関連 */}
                    <div className="mb-[40px]">
                      <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                        <SubHeading text='ラケット' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[64px] md:max-w-[72px]" />
                      </div>

                      <p className="text-[14px] h-[16px] mb-[8px] leading-[16px] md:text-[16px] md:h-[18px]">使用ラケット</p>

                      <div className="flex  mb-6 md:w-[100%] md:max-w-[360px]">
                        <div className="w-[120px] mr-6">
                          {racket && racket.racket_image.file_path
                            ? <img src={`${baseImagePath}${racket.racket_image.file_path}`} alt="ラケット画像" className="w-[120px] h-[160px]" />
                            : <img src={`${baseImagePath}images/rackets/default_racket_image.png`} alt="ラケット画像" className="w-[120px] h-[160px]" />
                          }
                        </div>

                        <div className="w-[100%] max-w-[176px] md:max-w-[216px] flex flex-col">
                          <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">選択中</p>

                          <div className="border rounded py-[8px] mb-[16px] mb-auto">
                            <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-[2px]">{racket ? racket.maker.name_en : ''}</p>
                            <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px] md:h-[20px]">{racket ? racket.name_ja : '未選択'}</p>
                          </div>

                          {!myEquipment && (
                            <>
                              <div className="flex justify-end">
                                <button type="button" onClick={openRacketSearchModal} className="text-white font-bold text-[14px] w-[128px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">ラケットを選択</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {errors.racket_id.length !== 0 &&
                        errors.racket_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>
                  </div>

                  {/* section-two */}
                  <div className="md:w-[100%] md:max-w-[360px]">
                    <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[360px]">
                      <SubHeading text='評価' className="text-[16px] md:text-[18px] md:mb-2" />
                      <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                    </div>

                    <div>
                      <EvaluationRangeItem
                        labelText="自分に合っているか"
                        scale={true}
                        onChangeInputRangeHnadler={(e) => { setMatchRate(Number(e.target.value)) }}
                        valueState={matchRate}
                        className="mb-6 md:mb-2"
                      />

                      <EvaluationRangeItem
                        labelText="切れにくさ"
                        scale={false}
                        onChangeInputRangeHnadler={(e) => { setPysicalDurability(Number(e.target.value)) }}
                        valueState={pysicalDurability}
                        className="mb-[41px] md:mb-[36px]"
                      />

                      <EvaluationRangeItem
                        labelText="打球感の持続"
                        scale={false}
                        onChangeInputRangeHnadler={(e) => { setPerformanceDurability(Number(e.target.value)) }}
                        valueState={performanceDurability}
                        className="mb-10"
                      />

                      <div className="mb-[16px] md:flex md:flex-col">
                        <label
                          htmlFor="review"
                          className="text-[14px] md:text-[16px] mb-1 md:mb-2"
                        >コメント</label>

                        <textarea
                          name="review"
                          id="review"
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="inline-block border border-gray-300 rounded w-[320px] min-h-[160px] p-2 focus:outline-sub-green md:w-[360px] md:min-h-[240px]"
                        />

                        {errors.review.length !== 0 &&
                          errors.review.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        }
                      </div>
                    </div>

                    <p className="text-[14px] md:text-[16px] mb-6 md:mb-4 md:mb-4">※ 装備構成を直接入力した場合は、その構成のマイ装備も作成されます</p>

                    <div className="flex justify-center md:justify-end">
                      <button
                        type="submit"
                        className="text-white font-bold text-[14px] w-[200px] h-8 rounded  bg-sub-green md:text-[16px] md:w-[160px]"
                      >投稿する</button>
                    </div>
                    {errors.main_gut_id.length !== 0 &&
                      errors.main_gut_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.cross_gut_id.length !== 0 &&
                      errors.cross_gut_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.racket_id.length !== 0 &&
                      errors.racket_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.review.length !== 0 &&
                      errors.review.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                </form>

                {/* gut検索モーダル */}
                <GutSearchModal
                  modalVisibility={gutSearchModalVisibility}
                  setModalVisibility={setGutSearchModalVisibility}
                  makers={makers}
                  closeModalHandler={closeModal}
                  selectGutHandler={selectGut}
                  showingResult={true}
                  searchedGuts={searchedGuts}
                  setSearchedGuts={setSearchedGuts}
                  zIndexClassName="z-50"
                  inputSearchWord={inputGutSearchWord}
                  setInputSearchWord={setInputGutSearchWord}
                  inputSearchMaker={inputGutSearchMaker}
                  setInputSearchMaker={setInputGutSearchMaker}
                />

                {/* racket検索モーダル */}
                <RacketSearchModal
                  modalVisibility={racketSearchModalVisibility}
                  setModalVisibility={setRacketSearchModalVisibility}
                  makers={makers}
                  selectRacketHandler={selectRacket}
                  showingResult={true}
                  searchedRackets={searchedRackets}
                  setSearchedRackets={setSearchedRackets}
                  zIndexClassName="z-40"
                  inputSearchWord={inputRacketSearchWord}
                  setInputSearchWord={setInputRacketSearchWord}
                  inputSearchMaker={inputRacketSearchMaker}
                  setInputSearchMaker={setInputRacketSearchMaker}
                  setRacketRegisterModalVisibility={setRacketRegisterModalVisibility}
                />

                {/* racket登録モーダル */}
                <RacketRegisterModal
                  modalVisibility={racketRegisterModalVisibility}
                  setModalVisibility={setRacketRegisterModalVisibility}
                  makers={makers}
                  zIndexClassName="z-50"
                  racketSeries={racketSeries}
                afterRegistringHandler={afterRegistringRacketHandler}
                />

                {/* my_equipment検索モーダル */}
                <div className={`bg-gray-300 w-screen h-screen fixed top-0 left-0 ${myEquipmentSearchModalVisibilityClassName} duration-[400ms] pt-[24px] overflow-y-scroll`}>
                  <div className="flex flex-col items-center w-[100%] max-w-[360px] mx-auto md:max-w-[768px]">
                    <div onClick={closeMyEquipmentSearchModal} className="self-end hover:cursor-pointer md:mr-[39px]">
                      <IoClose size={48} />
                    </div>

                    <form action="" onSubmit={searchMyEquipments} className="mb-[24px] md:flex md:flex-wrap md:justify-center md:mb-[40px]">
                      {/* キーワード検索 */}
                      <div className="mb-6 md:mb-0 md:mr-[16px]">
                        <label htmlFor="several_words" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">検索ワード</label>
                        <input type="text" name="several_words" onChange={(e) => setInputMyEquipmentSearchWord(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[300px] h-10 p-2 focus:outline-sub-green" />
                      </div>

                      {/* 張り方 */}
                      <div className="w-[100%] max-w-[320px] mb-8 md:max-w-[160px] md:mb-0 md:mr-4">
                        <label htmlFor="stringing_way" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ストリングの張り方</label>

                        <select
                          name="stringing_way"
                          id="stringing_way"
                          value={inputMyEquipmentSearchStringingWay}
                          onChange={(e) => setInputMyEquipmentSearchStringingWay(e.target.value)}
                          className="border border-gray-300 rounded w-[160px] h-10 p-2 focus:outline-sub-green"
                        >
                          <option value="" >未選択</option>
                          <option value="single" >単張り</option>
                          <option value="hybrid" >ハイブリッド</option>
                        </select>

                        {/* {errors.stringing_way.length !== 0 &&
                          errors.stringing_way.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        } */}
                      </div>

                      {/* gutを新調日 */}
                      <div className="mb-6 md:w-[240px] md:mb-0">
                        <div className="flex flex-wrap ">
                          <label
                            htmlFor="search_date"
                            className="text-[14px] mb-1 basis-[320px] md:basis-[160px] md:text-[16px]  md:mb-[8px]"
                          >張った日</label>

                          <input
                            type="date"
                            name="search_date"
                            id="search_date"
                            defaultValue={today}
                            onChange={(e) => setInputMyEquipmentSearchDate(e.target.value)}
                            className="inline-block border border-gray-300 rounded w-[140px] h-10 p-2 focus:outline-sub-green mr-1"
                          />

                          <select
                            name="date_range_type"
                            id="date_range_type"
                            value={inputMyEquipmentSearchDateRangeType}
                            onChange={(e) => setInputMyEquipmentSearchDateRangeType(e.target.value)}
                            className="border border-gray-300 rounded w-[80px] h-10 p-2 focus:outline-sub-green"
                          >
                            <option value="or_more" >以降</option>
                            <option value="or_less" >以前</option>
                          </select>
                        </div>

                        {errors.new_gut_date.length !== 0 &&
                          errors.new_gut_date.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        }
                      </div>

                      <div className="flex justify-end md:justify-end basis-[100%] md:mr-[34px] md:mt-4">
                        <button type="submit" className="text-white font-bold text-[14px] w-[160px] h-8 rounded  bg-sub-green md:text-[16px] md:self-end md:h-[40px] md:w-[100px]">検索する</button>
                      </div>
                    </form>

                    {/* 検索結果表示欄 */}
                    <div className="w-[100%] max-w-[360px] md:max-w-[768px]">
                      <p className="text-[14px] mb-[16px] md:text-[16px] md:max-w-[640px] md:mx-auto">検索結果</p>
                      <div className="flex justify-between flex-wrap gap-[48px] w-[100%] max-w-[360px] md:max-w-[768px] md:mx-auto">
                        {searchedMyEquipments && (
                          searchedMyEquipments.map(myEquipment => {
                            return (
                              <>
                                <MyEquipmentCard
                                  myEquipment={myEquipment}
                                  clickHandler={() => selectMyEquipment(myEquipment)}
                                />
                              </>
                            );
                          })
                        )}
                      </div>

                      <Pagination
                        paginator={myEquipmentsPaginator}
                        paginate={getSearchedMyEquipmentsList}
                        className="mt-[32px] mb-[32px] md:mt-[48px] md:mb-[48px]"
                      />
                    </div>
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

export default GutReviewRegister;

