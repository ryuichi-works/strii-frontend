import type { NextPage } from "next";
import type { Maker, Racket, TennisProfile } from "../users/[id]/profile";
import type { Gut } from "../reviews";

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
import { getToday } from "@/modules/getToday";
import GutSearchModal from "@/components/GutSearchModal";
import RacketSearchModal from "@/components/RacketSearchModal";
import { RacketSeries } from "@/types/global";
import RacketRegisterModal from "@/components/RacketRegisterModal";

const MyEquipmentRegister: NextPage = () => {
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
  const [makers, setMakers] = useState<Maker[]>();

  const [witchSelectingGut, setWitchSelectingGut] = useState<string>('');

  const [racketSeries, setRacketSeries] = useState<RacketSeries[]>();

  // inputに関するstate
  const [inputMainGutGuage, setInputMainGutGuage] = useState<number>(1.25);

  const [inputCrossGutGuage, setInputCrossGutGuage] = useState<number>(1.25);

  const [inputMainGutTension, setInputMainGutTension] = useState<number>(50);

  const [inputMainCrossTension, setInputMainCrossTension] = useState<number>(50);

  const [inputNewGutDate, setInputNewGutDate] = useState<string>(today);

  const [inputChangeGutDate, setInputChangeGutDate] = useState<string>();

  const [comment, setComment] = useState<string>('');

  //モーダルの開閉に関するstate
  const [gutSearchModalVisibility, setGutSearchModalVisibility] = useState<boolean>(false);

  const [racketSearchModalVisibility, setRacketSearchModalVisibility] = useState<boolean>(false);

  const [racketRegisterModalVisibility, setRacketRegisterModalVisibility] = useState<boolean>(false);

  //検索関連のstate
  const [inputGutSearchWord, setInputGutSearchWord] = useState<string>('');
  const [inputGutSearchMaker, setInputGutSearchMaker] = useState<number>();
  const [inputRacketSearchWord, setInputRacketSearchWord] = useState<string>('');
  const [inputRacketSearchMaker, setInputRacketSearchMaker] = useState<number>();

  const [searchedGuts, setSearchedGuts] = useState<Gut[]>();

  const [searchedRackets, setSearchedRackets] = useState<Racket[]>();

  useEffect(() => {
    const getMakerList = async () => {
      await axios.get('api/makers').then(res => {
        setMakers(res.data);
      })
    }

    const getUserTennisProfile = async () => {
      await axios.get(`api/tennis_profiles/user/${user.id}`).then(res => {
        setUserTennisProfile(res.data);
        if(res.data.racket) {
          setRacket(res.data.racket);
        }
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

  //inputの制御関数群
  const onChangeInputStringingWay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStringingWay(e.target.value);
    setCrossGut(undefined);
  }

  const onChangeInputNewGutDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const todayRegex: RegExp = /\d{4}-\d{2}-\d{2}$/;

    if (todayRegex.test(e.target.value)) {
      setInputNewGutDate(e.target.value);
    }
  }

  const onChangeInputChangeGutDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const todayRegex: RegExp = /\d{4}-\d{2}-\d{2}$/;

    if (todayRegex.test(e.target.value)) {
      setInputChangeGutDate(e.target.value);
    }
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
    change_gut_date: string[],
    comment: string[],
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
    change_gut_date: [],
    comment: [],
  }

  const [errors, setErrors] = useState<Errors>(initialErrorVals);

  //gut登録処理関連
  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const registerGut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerData = {
      user_id: user.id,
      user_height: userTennisProfile?.height,
      user_age: userTennisProfile?.age,
      experience_period: userTennisProfile?.experience_period,
      stringing_way: stringingWay,
      main_gut_id: mainGut?.id,
      cross_gut_id: stringingWay === 'hybrid' && crossGut ? crossGut.id : mainGut?.id,
      main_gut_guage: inputMainGutGuage,
      cross_gut_guage: inputCrossGutGuage,
      main_gut_tension: inputMainGutTension,
      cross_gut_tension: inputMainCrossTension,
      racket_id: racket?.id,
      new_gut_date: inputNewGutDate,
      change_gut_date: inputChangeGutDate ? inputChangeGutDate : null,
      comment: comment,
    }

    await csrf();

    await axios.post('api/my_equipments', registerData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(res => {
      console.log('マイ装備を追加しました。');

      router.push('/my_equipments');
    }).catch((e) => {
      const newErrors = { ...initialErrorVals, ...e.response.data.errors };

      setErrors(newErrors);

      console.log('マイ装備の追加に失敗しました');
    })
  }

  return (
    <>
      <AuthCheck>
        {(isAuth || isAuthAdmin) && (
          <>
            <div className="container mx-auto">
              <div className="text-center my-6 md:mb-[32px]">
                <PrimaryHeading text="マイ装備追加" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">

                <form
                  onSubmit={registerGut}
                  className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:justify-between"
                >

                  {/* //section-one */}
                  <div className="md:w-[100%] md:max-w-[360px]">
                    {/* ストリング関連 */}
                    <div>
                      <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                        <SubHeading text='ストリング' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                      </div>

                      {/* 張り方選択 */}
                      <div className="w-[100%] max-w-[320px] mb-8 md:max-w-[360px]">
                        <label htmlFor="stringing_way" className="block text-[14px] md:text-[16px]">ストリングの張り方</label>

                        <select
                          name="stringing_way"
                          id="stringing_way"
                          value={stringingWay}
                          onChange={onChangeInputStringingWay}
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
                                : <div className="w-[120px] h-[120px] border"></div>
                              }
                            </div>

                            <div className="w-[100%] max-w-[176px] md:max-w-[216px]">
                              <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">選択中</p>

                              <div className="border rounded py-[8px] mb-[16px] md:mb-[8px]">
                                <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-1">{mainGut ? mainGut.maker.name_en : ''}</p>
                                <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px] md:h-[20px]">{mainGut ? mainGut.name_ja : '未選択'}</p>
                              </div>

                              <div className="flex justify-end">
                                <button type="button" onClick={openMainGutSearchModal} className="text-white font-bold text-[14px] w-[80px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">変更</button>
                              </div>
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
                                    : <div className="w-[120px] h-[120px] border"></div>
                                  }
                                </div>

                                <div className="w-[100%] max-w-[176px] md:max-w-[216px]">
                                  <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">選択中</p>

                                  <div className="border rounded py-[8px] mb-[16px] md:mb-[8px]">
                                    <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-1">{crossGut ? crossGut.maker.name_ja : ''}</p>
                                    <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px] md:h-[20px]">{crossGut ? crossGut.name_ja : '未選択'}</p>
                                  </div>

                                  <div className="flex justify-end">
                                    <button type="button" onClick={openCrossGutSearchModal} className="text-white font-bold text-[14px] w-[80px] h-[32px] rounded ml-auto  bg-sub-green  md:text-[16px]">変更</button>
                                  </div>
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
                            defaultValue={1.25}
                            min="1.05"
                            max="1.50"
                            onChange={(e) => setInputMainGutGuage(Number(e.target.value))}
                            className="inline-block border border-gray-300 rounded w-[72px] h-10 p-2 focus:outline-sub-green mr-1"
                          />
                          <span className="inline-block text-[14px] h-[16px] leading-[16px] mr-[16px] md:text-[16px] md:h-[18px]">mm</span>
                          <span className="inline-block text-[16px] text-center h-[18px] leading-[16px] mr-[16px] w-[100%] max-w-[16px] md:text-[16px] md:h-[18px]">/</span>
                          <input
                            type="number"
                            name="cross_gut_guage"
                            step={0.01}
                            defaultValue={1.25}
                            min="1.05"
                            max="1.50"
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
                            defaultValue={50}
                            min="1"
                            max="100"
                            onChange={(e) => setInputMainGutTension(Number(e.target.value))}
                            className="inline-block border border-gray-300 rounded w-[64px] h-10 p-2 focus:outline-sub-green mr-1"
                          />
                          <span className="inline-block text-[16px] text-center h-[18px] mb-[4px] leading-[16px] mr-[4px] w-[100%] max-w-[16px] md:text-[16px] md:h-[18px]">/</span>
                          <input
                            type="number"
                            name="cross_gut_guage"
                            step={1}
                            defaultValue={50}
                            min="1"
                            max="100"
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

                      {/* gutを新調日 */}
                      <div className=" mb-6">
                        <div className="flex flex-col">
                          <label htmlFor="new_gut_date" className="text-[14px] h-[16px] mb-1 md:text-[16px] md:h-[18px] md:mb-[8px]">張った日</label>
                          <input
                            type="date"
                            name="new_gut_date"
                            id="new_gut_date"
                            defaultValue={today}
                            onChange={onChangeInputNewGutDate}
                            className="inline-block border border-gray-300 rounded w-[140px] h-10 p-2 focus:outline-sub-green mr-1"
                          />
                        </div>

                        {errors.new_gut_date.length !== 0 &&
                          errors.new_gut_date.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        }
                      </div>

                      {/* gut交換日 */}
                      <div className="mb-[40px]">
                        <div className="flex flex-col">
                          <label htmlFor="change_gut_date" className="text-[14px] h-[16px] mb-1 md:text-[16px] md:h-[18px] md:mb-[8px]">張り替え・ストリングが切れた日</label>
                          <input
                            type="date"
                            name="change_gut_date"
                            id="change_gut_date"
                            onChange={onChangeInputChangeGutDate}
                            className="inline-block border border-gray-300 rounded w-[140px] h-10 p-2 focus:outline-sub-green mr-1"
                          />
                        </div>

                        {errors.change_gut_date.length !== 0 &&
                          errors.change_gut_date.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        }
                      </div>
                    </div>
                  </div>

                  {/* section-two */}
                  <div className="md:w-[100%] md:max-w-[360px]">
                    {/* ラケット関連 */}
                    <div className="mb-[40px]">
                      <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                        <SubHeading text='ラケット' className="text-[16px] md:text-[18px] md:mb-2" />
                        <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
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

                          <div className="flex justify-end">
                            <button type="button" onClick={openRacketSearchModal} className="text-white font-bold text-[14px] w-[128px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">ラケットを選択</button>
                          </div>
                        </div>
                      </div>

                      {errors.racket_id.length !== 0 &&
                        errors.racket_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="mb-[48px] md:flex md:flex-col md:mb-[64px]">
                      <label htmlFor="comment">コメント</label>
                      <textarea
                        name="comment"
                        id="comment"
                        onChange={(e) => setComment(e.target.value)}
                        className="inline-block border border-gray-300 rounded w-[320px] min-h-[160px] p-2 focus:outline-sub-green md:w-[360px] md:min-h-[240px]"
                      />

                      {errors.comment.length !== 0 &&
                        errors.comment.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="flex justify-center md:justify-end">
                      <button
                        type="submit"
                        className="text-white font-bold text-[14px] w-[200px] h-8 rounded  bg-sub-green md:text-[16px] md:w-[160px]"
                      >追加する</button>
                    </div>
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
              </div>
            </div>
          </>

        )}
      </AuthCheck>

    </>
  );
}

export default MyEquipmentRegister;
