import type { NextPage } from "next";
import type { Maker, Racket, TennisProfile } from "@/pages/users/[id]/profile";
import type { Gut, MyEquipment, Review } from "..";

import axios from "@/lib/axios";
import Cookies from "js-cookie";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import { AuthContext } from "@/context/AuthContext";

import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import SubHeading from "@/components/SubHeading";
import TextUnderBar from "@/components/TextUnderBar";
import { IoClose } from "react-icons/io5";
import Pagination, { Paginator } from "@/components/Pagination";
import EvaluationRangeItem from "@/components/EvaluationRangeItem";
import GutSearchModal from "@/components/GutSearchModal";
import RacketSearchModal from "@/components/RacketSearchModal";
import { getToday } from "@/modules/getToday";

type EditingGutReviewData = {
  _method: 'PUT',
  match_rate: number | undefined,
  pysical_durability: number,
  performance_durability: number,
  review: string,
  need_editing_my_equipment: boolean,

  stringing_way?: string,
  main_gut_id?: number,
  cross_gut_id?: number,
  main_gut_guage?: number,
  cross_gut_guage?: number,
  main_gut_tension?: number,
  cross_gut_tension?: number,
  racket_id?: number,
}

const GutReviewEdit: NextPage = () => {
  const router = useRouter();

  const reviewId = router.query.id;

  const { isAuth, user, isAuthAdmin } = useContext(AuthContext);

  const today: string = getToday();

  const [review, setReview] = useState<Review>();

  //my_equipmentの登録に使うstate群
  const [stringingWay, setStringingWay] = useState<string>('single');

  const [mainGut, setMainGut] = useState<Gut>();

  const [crossGut, setCrossGut] = useState<Gut>();

  const [racket, setRacket] = useState<Racket>();

  //要素の表示などに使用するstate群
  const [myEquipment, setMyEquipment] = useState<MyEquipment>();

  const [makers, setMakers] = useState<Maker[]>();

  const [witchSelectingGut, setWitchSelectingGut] = useState<string>('');

  // inputに関するstate
  const [inputMainGutGuage, setInputMainGutGuage] = useState<number>(1.25);

  const [inputCrossGutGuage, setInputCrossGutGuage] = useState<number>(1.25);

  const [inputMainGutTension, setInputMainGutTension] = useState<number>(50);

  const [inputMainCrossTension, setInputCrossGutTension] = useState<number>(50);

  //モーダルの開閉に関するstate
  const [gutSearchModalVisibility, setGutSearchModalVisibility] = useState<boolean>(false);

  const [racketSearchModalVisibility, setRacketSearchModalVisibility] = useState<boolean>(false);

  //検索関連のstate
  const [inputGutSearchWord, setInputGutSearchWord] = useState<string>('');
  const [inputGutSearchMaker, setInputGutSearchMaker] = useState<number>();
  const [inputRacketSearchWord, setInputRacketSearchWord] = useState<string>('');
  const [inputRacketSearchMaker, setInputRacketSearchMaker] = useState<number>();

  const [searchedGuts, setSearchedGuts] = useState<Gut[]>();

  const [searchedRackets, setSearchedRackets] = useState<Racket[]>();

  // 評価に関するstate
  const [matchRate, setMatchRate] = useState<number>(3);

  const [pysicalDurability, setPysicalDurability] = useState<number>(3);

  const [performanceDurability, setPerformanceDurability] = useState<number>(3);

  const [reviewComment, setReviewComment] = useState<string>('');

  // 装備構成のmyEquipment情報を編集するかどうかの識別値
  const [needEditingMyEquipment, setNeedEditingMyEquipment] = useState<boolean>(false);

  useEffect(() => {
    const getMakerList = async () => {
      await axios.get('api/makers').then(res => {
        setMakers(res.data);
      })
    }

    const getReview = async () => {
      const response = await axios.get(`api/gut_reviews/${reviewId}`);
      const _review: Review = response.data;

      return _review;
    }

    // 各データの初期値をセット
    const setInitialStates = async () => {
      const _review: Review = await getReview();

      setReview(_review);
      setMyEquipment(_review.my_equipment);
      setStringingWay(_review.my_equipment.stringing_way)
      setMainGut(_review.my_equipment.main_gut)
      setCrossGut(_review.my_equipment.cross_gut)
      setInputMainGutGuage(_review.my_equipment.main_gut_guage)
      setInputCrossGutGuage(_review.my_equipment.cross_gut_guage)
      setInputMainGutTension(_review.my_equipment.main_gut_tension);
      setInputCrossGutTension(_review.my_equipment.cross_gut_tension)
      setRacket(_review.my_equipment.racket);
      setMatchRate(_review.match_rate);
      setPysicalDurability(_review.pysical_durability)
      setPerformanceDurability(_review.performance_durability)
      setReviewComment(_review.review)
    }


    getMakerList();
    setInitialStates();
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

  //inputの制御関数群
  const onChangeInputStringingWay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStringingWay(e.target.value);
    setCrossGut(undefined);
  }

  const onChangeInputSearchMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setInputGutSearchMaker(undefined);
      return
    };

    setInputGutSearchMaker(Number(e.target.value));
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

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

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

  type Errors = {
    stringing_way: string[],
    main_gut_id: string[],
    cross_gut_id: string[],
    main_gut_guage: string[],
    cross_gut_guage: string[],
    main_gut_tension: string[],
    cross_gut_tension: string[],
    racket_id: string[],
    review: string[]
  }

  const initialErrorVals = {
    stringing_way: [],
    main_gut_id: [],
    cross_gut_id: [],
    main_gut_guage: [],
    cross_gut_guage: [],
    main_gut_tension: [],
    cross_gut_tension: [],
    racket_id: [],
    review: [],
  }

  const [errors, setErrors] = useState<Errors>(initialErrorVals);

  //review登録処理関連
  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const editGutReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let editedData: EditingGutReviewData = {
      _method: 'PUT',
      match_rate: matchRate,
      pysical_durability: pysicalDurability,
      performance_durability: performanceDurability,
      review: reviewComment,
      need_editing_my_equipment: needEditingMyEquipment,
    }

    // myEquipmentの変更もする場合にeditedDataに必要項目を追加
    if (needEditingMyEquipment) {
      editedData.stringing_way = stringingWay;
      editedData.main_gut_id = mainGut?.id;
      editedData.cross_gut_id = stringingWay === 'hybrid' && crossGut ? crossGut.id : mainGut?.id;
      editedData.main_gut_guage = inputMainGutGuage;
      editedData.cross_gut_guage = inputCrossGutGuage;
      editedData.main_gut_tension = inputMainGutTension;
      editedData.cross_gut_tension = inputMainCrossTension;
      editedData.racket_id = racket?.id;
    }

    await csrf();

    await axios.post(`api/gut_reviews/${reviewId}`, editedData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(res => {
      console.log('レビューを更新しました。');

      router.push(`/reviews/${reviewId}/review`);
    }).catch((e) => {
      const newErrors = { ...initialErrorVals, ...e.response.data.errors };

      setErrors(newErrors);

      console.log('レビュー更新に失敗しました');
    })
  }

  const resetMyEquipmentState = () => {
    if (myEquipment) {
      setStringingWay(myEquipment?.stringing_way)
      setMainGut(myEquipment.main_gut)
      setCrossGut(myEquipment.cross_gut)
      setInputMainGutGuage(myEquipment.main_gut_guage)
      setInputCrossGutGuage(myEquipment.cross_gut_guage)
      setInputMainGutTension(myEquipment.main_gut_tension);
      setInputCrossGutTension(myEquipment.cross_gut_tension)
      setRacket(myEquipment.racket);
    }

    inactivateEdittingMyEquipment();
  }

  const resetEvaluationState = () => {
    if (review) {
      setMatchRate(review.match_rate);
      setPysicalDurability(review.pysical_durability)
      setPerformanceDurability(review.performance_durability)
      setReviewComment(review.review)
    }
  }

  // myEquipment編集可否の状態変更
  const activateEdittingMyEquipment = () => {
    setNeedEditingMyEquipment(true);
  }

  const inactivateEdittingMyEquipment = () => {
    setNeedEditingMyEquipment(false);
  }

  return (
    <>
      <AuthCheck>
        {(isAuth || isAuthAdmin) && (
          <>
            <Head>
              <title>
                レビュー編集 - {review ? `${review?.my_equipment.main_gut.name_ja}(${review?.my_equipment.main_gut.maker.name_en})` : ''}
                {review?.my_equipment.stringing_way === 'hybrid'
                  ? `/${review?.my_equipment.cross_gut.name_ja}(${review?.my_equipment.cross_gut.maker.name_en})`
                  : ''}
              </title>
            </Head>

            <div className="container mx-auto mb-6">
              <div className="text-center my-6 md:mb-[32px]">
                <PrimaryHeading text="Post Review" className="text-[18px] italic h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">

                <form
                  onSubmit={editGutReview}
                  className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:justify-between"
                >

                  {/* //section-one */}
                  <div className="md:w-[100%] md:max-w-[360px]">
                    <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                      <SubHeading text='装備構成' className="text-[16px] md:text-[18px] md:mb-2" />
                      <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                    </div>

                    <div className="flex justify-end">
                      {needEditingMyEquipment
                        ? <button type="button" onClick={resetMyEquipmentState} className="text-white font-bold text-[14px] w-[128px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">リセット</button>
                        : <button type="button" onClick={activateEdittingMyEquipment} className="text-white font-bold text-[14px] w-[160px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">マイ装備を編集</button>
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
                          value={needEditingMyEquipment ? stringingWay : myEquipment?.stringing_way}
                          onChange={onChangeInputStringingWay}
                          disabled={!needEditingMyEquipment}
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
                                ? <img src={`${mainGut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                                : <div className="w-[120px] h-[120px] border"></div>
                              }
                            </div>

                            <div className="w-[100%] max-w-[176px] md:max-w-[216px]">
                              <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">選択中</p>

                              <div className="border rounded py-[8px] mb-[16px] md:mb-[8px]">
                                <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-1">{mainGut ? mainGut.maker.name_en : ''}</p>
                                <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px] md:h-[20px]">{mainGut ? mainGut.name_ja : '未選択'}</p>
                              </div>

                              {needEditingMyEquipment && (
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

                        {stringingWay === 'hybrid' && (
                          <>
                            <div className=" mb-6">

                              <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">クロス</p>

                              <div className="flex md:w-[100%] md:max-w-[360px]">
                                <div className="w-[120px] mr-6">
                                  {crossGut && crossGut.gut_image.file_path
                                    ? <img src={`${crossGut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                                    : <div className="w-[120px] h-[120px] border"></div>
                                  }
                                </div>

                                <div className="w-[100%] max-w-[176px] md:max-w-[216px]">
                                  <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">選択中</p>

                                  <div className="border rounded py-[8px] mb-[16px] md:mb-[8px]">
                                    <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-1">{crossGut ? crossGut.maker.name_ja : ''}</p>
                                    <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px] md:h-[20px]">{crossGut ? crossGut.name_ja : '未選択'}</p>
                                  </div>

                                  {needEditingMyEquipment && (
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
                            disabled={!needEditingMyEquipment}
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
                            disabled={!needEditingMyEquipment}
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
                            disabled={!needEditingMyEquipment}
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
                            disabled={!needEditingMyEquipment}
                            onChange={(e) => setInputCrossGutTension(Number(e.target.value))}
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
                            ? <img src={`${racket.racket_image.file_path}`} alt="ラケット画像" className="w-[120px] h-[160px]" />
                            : <div className="w-[120px] h-[160px] border"></div>
                          }
                        </div>

                        <div className="w-[100%] max-w-[176px] md:max-w-[216px] flex flex-col">
                          <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">選択中</p>

                          <div className="border rounded py-[8px] mb-[16px] mb-auto">
                            <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-[2px]">{racket ? racket.maker.name_en : ''}</p>
                            <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px] md:h-[20px]">{racket ? racket.name_ja : '未選択'}</p>
                          </div>

                          {needEditingMyEquipment && (
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
                    <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[360px] md:mb-4">
                      <SubHeading text='評価' className="text-[16px] md:text-[18px] md:mb-2" />
                      <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                    </div>

                    <div className="flex justify-end md:mb-2">
                      <button type="button" onClick={resetEvaluationState} className="text-white font-bold text-[14px] w-[128px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">リセット</button>
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
                          value={reviewComment}
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
                      >編集する</button>
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
                  zIndexClassName="z-50"
                  inputSearchWord={inputRacketSearchWord}
                  setInputSearchWord={setInputRacketSearchWord}
                  inputSearchMaker={inputRacketSearchMaker}
                  setInputSearchMaker={setInputRacketSearchMaker}
                />
              </div>
            </div>
          </>

        )}
      </AuthCheck>

    </>
  );
}

export default GutReviewEdit;

