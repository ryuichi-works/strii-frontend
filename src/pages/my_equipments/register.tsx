import type { NextPage } from "next";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import SubHeading from "@/components/SubHeading";
import TextUnderBar from "@/components/TextUnderBar";
import { Gut } from "../reviews";
import { IoClose } from "react-icons/io5";
import { Maker } from "../users/[id]/profile";
import axios from "@/lib/axios";
import { getToday } from "@/modules/getToday";

// import Modal from "@/components/Modal";
// import { useModal } from "@/hooks/useModal";

const MyEquipmentRegister: NextPage = () => {
  const { isAuth, user, isAuthAdmin } = useContext(AuthContext);

  const [stringingWay, setStringingWay] = useState<string>();
  console.log('stringingWay', stringingWay)

  const [mainGut, setMainGut] = useState<Gut>();
  console.log('mainGut', mainGut)

  const [crossGut, setCrossGut] = useState<Gut>();
  console.log('crossGut', crossGut)

  const [makers, setMakers] = useState<Maker[]>();
  console.log('makers', makers)

  const [witchSelectingGut, setWitchSelectingGut] = useState<string>('');
  console.log('witchSelectingGut', witchSelectingGut)

  // inputに関するstate
  const [inputMainGutGuage, setInputMainGutGuage] = useState<number>(1.25);
  console.log('inputMainGutGuage', inputMainGutGuage)
  
  const [inputCrossGutGuage, setInputCrossGutGuage] = useState<number>(1.25);
  console.log('inputCrossGutGuage', inputCrossGutGuage)

  const [inputMainGutTension, setInputMainGutTension] = useState<number>(50);
  console.log('inputMainGutTension', inputMainGutTension)

  const [inputMainCrossTension, setInputMainCrossTension] = useState<number>(50);
  console.log('inputMainCrossTension', inputMainCrossTension)

  const [inputNewGutDate, setInputNewGutDate ] = useState<string>();
  console.log('inputNewGutDate', inputNewGutDate)

  const [inputChangeGutDate, setInputChangeGutDate ] = useState<string>();
  console.log('inputChangeGutDate', inputChangeGutDate)


  //モーダルの開閉に関するstate
  const [modalVisibilityClassName, setModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  //検索関連のstate
  const [inputSearchWord, setInputSearchWord] = useState<string>('');
  console.log('inputSearchWord', inputSearchWord)

  const [inputSearchMaker, setInputSearchMaker] = useState<number | null>();
  console.log('inputSearchMaker', inputSearchMaker)

  const [searchedGuts, setSearchedGuts] = useState<Gut[]>();
  console.log('searchedGuts', searchedGuts)

  const today: string = getToday();

  useEffect(() => {
    const getMakerList = async () => {
      await axios.get('api/makers').then(res => {
        setMakers(res.data);
      })
    }

    getMakerList();
  }, [])

  const onChangeInputStringingWay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStringingWay(e.target.value);
    setCrossGut(undefined);
  }

  const onChangeInputSearchMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setInputSearchMaker(null);
      return
    };

    setInputSearchMaker(Number(e.target.value));
  }

  const onChangeInputNewGutDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const todayRegex: RegExp = /\d{4}-\d{2}-\d{2}$/;

    if(todayRegex.test(e.target.value)) {
      setInputNewGutDate(e.target.value);
    }
  }

  const onChangeInputChangeGutDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const todayRegex: RegExp = /\d{4}-\d{2}-\d{2}$/;

    if(todayRegex.test(e.target.value)) {
      setInputChangeGutDate(e.target.value);
    }
  }

  //モーダルの開閉
  const closeModal = () => {
    setModalVisibilityClassName('opacity-0 scale-0')
    setWitchSelectingGut('');
  }

  const openModal = () => {
    setModalVisibilityClassName('opacity-100 scale-100')
  }

  //gutを選んだ際、mainGut,crossGutで分けて値をstateにセットさせたかったためopenModalを分けてある
  const openMainGutSearchModal = () => {
    openModal();
    setWitchSelectingGut('main');
  }

  const openCrossGutSearchModal = () => {
    openModal();
    setWitchSelectingGut('cross');
  }

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'


  //gut検索
  const searchGuts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.get('api/guts/search', {
        params: {
          several_words: inputSearchWord,
          maker: inputSearchMaker
        }
      }).then((res) => {
        setSearchedGuts(res.data);
      })

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

  return (
    <>
      <AuthCheck>
        {(isAuth || isAuthAdmin) && (
          <>
            <h1>マイ装備登録ページ</h1>
            <div className="container mx-auto">
              <div className="text-center mb-6 md:mb-[48px]">
                <PrimaryHeading text="マイ装備追加" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="w-[100%] max-w-[320px] mx-auto">
                <div className="w-[100%] max-w-[320px] mb-4 md:max-w-[360px]">
                  <SubHeading text='ストリング' className="text-[16px] md:text-[18px] md:mb-2" />
                  <TextUnderBar className="w-[100%] max-w-[320px] md:max-w-[360px]" />
                </div>

                <form action="">
                  {/* 張り方選択 */}
                  <div className=" mb-8">
                    <label htmlFor="stringing_way" className="block text-[14px] md:text-[16px]">ストリングの張り方</label>

                    <select name="stringing_way" id="stringing_way" value={stringingWay} onChange={onChangeInputStringingWay} className="border border-gray-300 rounded w-[160px] md:w-[380px] h-10 p-2 focus:outline-sub-green">
                      <option value="single" >単張り</option>
                      <option value="hybrid" >ハイブリッド</option>
                    </select>

                    {/* {errors.maker_id.length !== 0 &&
                      errors.maker_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    } */}
                  </div>

                  {/* ストリング選択セクション */}
                  <div>
                    <input type="hidden" name="main_gut_id" value={mainGut ? mainGut.id : undefined} />
                    <input type="hidden" name="cross_gut_id" value={crossGut ? crossGut.id : undefined} />

                    <p className="text-[14px] h-[16px] mb-[8px] leading-[16px]">使用ストリング</p>

                    {stringingWay === 'hybrid' && <p className="text-[14px] h-[16px] mb-[4px] leading-[16px]">メイン</p>}

                    <div className="flex  mb-6 md:w-[100%] md:max-w-[360px]">
                      <div className="w-[120px] mr-6">
                        {mainGut && mainGut.gut_image.file_path
                          ? <img src={`${baseImagePath}${mainGut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                          : <img src={`${baseImagePath}images/guts/default_gut_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                        }
                      </div>

                      <div className="w-[100%] max-w-[176px] md:max-w-[216px]">
                        <p className="text-[14px] h-[16px] mb-[4px] leading-[16px]">選択中</p>

                        <div className="border rounded py-[8px] mb-[16px]">
                          <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px]">{mainGut ? mainGut.maker.name_en : ''}</p>
                          <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px]">{mainGut ? mainGut.name_ja : '未選択'}</p>
                        </div>

                        <div className="flex justify-end">
                          <button type="button" onClick={openMainGutSearchModal} className="text-white font-bold text-[14px] w-[80px] h-[32px] rounded ml-auto  bg-sub-green">変更</button>
                        </div>
                      </div>
                    </div>

                    {/* ハイブリッド張りの時crossGutを表示 */}
                    {stringingWay === 'hybrid' && (
                      <>
                        <p className="text-[14px] h-[16px] mb-[4px] leading-[16px]">クロス</p>

                        <div className="flex  mb-6 md:w-[100%] md:max-w-[360px]">
                          <div className="w-[120px] mr-6">
                            {crossGut && crossGut.gut_image.file_path
                              ? <img src={`${baseImagePath}${crossGut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                              : <img src={`${baseImagePath}images/guts/default_gut_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                            }
                          </div>

                          <div className="w-[100%] max-w-[176px] md:max-w-[216px]">
                            <p className="text-[14px] h-[16px] mb-[4px] leading-[16px]">選択中</p>

                            <div className="border rounded py-[8px] mb-[16px]">
                              <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px]">{crossGut ? crossGut.maker.name_ja : ''}</p>
                              <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px]">{crossGut ? crossGut.name_ja : '未選択'}</p>
                            </div>

                            <div className="flex justify-end">
                              <button type="button" onClick={openCrossGutSearchModal} className="text-white font-bold text-[14px] w-[80px] h-[32px] rounded ml-auto  bg-sub-green">変更</button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  </div>

                  {/* gut太さ選択 */}
                  <div className="mb-[24px]">
                    <p className="text-[14px] h-[16px] mb-[4px] leading-[16px]">太さ（メイン / クロス）</p>
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
                      <span className="inline-block text-[14px] h-[16px] leading-[16px] mr-[16px]">mm</span>
                      <span className="inline-block text-[16px] text-center h-[18px] leading-[16px] mr-[16px] w-[100%] max-w-[16px]">/</span>
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
                      <span className="inline-block text-[14px] h-[16px] leading-[16px]">mm</span>
                    </div>
                  </div>

                  {/* gutテンション選択 */}
                  <div className="mb-6">
                    <p className="text-[14px] h-[16px] mb-[4px] leading-[16px]">テンション（メイン / クロス）</p>
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
                      <span className="inline-block text-[16px] text-center h-[18px] mb-[4px] leading-[16px] mr-[4px] w-[100%] max-w-[16px]">/</span>
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
                      <span className="inline-block text-[14px] h-[16px] leading-[16px]">ポンド</span>
                    </div>
                  </div>

                  {/* gutを新調日 */}
                  <div className="flex flex-col mb-6">
                    <label htmlFor="new_gut_date" className="mb-1">張った日</label>
                    <input
                      type="date"
                      name="new_gut_date"
                      id="new_gut_date"
                      defaultValue={today}
                      onChange={onChangeInputNewGutDate}
                      className="inline-block border border-gray-300 rounded w-[140px] h-10 p-2 focus:outline-sub-green mr-1"
                    />
                  </div>

                  {/* gut交換日 */}
                  <div className="flex flex-col">
                    <label htmlFor="change_gut_date" className="mb-1">張り替え・ストリングが切れた日</label>
                    <input
                      type="date"
                      name="change_gut_date"
                      id="change_gut_date"
                      onChange={onChangeInputChangeGutDate}
                      className="inline-block border border-gray-300 rounded w-[140px] h-10 p-2 focus:outline-sub-green mr-1"
                    />
                  </div>


                </form>

                {/* gut検索モーダル */}
                <div className={`bg-gray-300 w-screen min-h-screen absolute top-[64px] left-0 ${modalVisibilityClassName} duration-[400ms] pt-[24px] overflow-y-auto`}>
                  <div className="flex flex-col items-center w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">
                    <div onClick={closeModal} className="self-end hover:cursor-pointer md:mr-[39px]">
                      <IoClose size={48} />
                    </div>

                    <form action="" onSubmit={searchGuts} className="mb-[24px] md:flex md:mb-[40px]">
                      <div className="mb-6 md:mb-0 md:mr-[16px]">
                        <label htmlFor="several_words" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ストリング　検索ワード</label>
                        <input type="text" name="several_words" onChange={(e) => setInputSearchWord(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[300px] h-10 p-2 focus:outline-sub-green" />
                      </div>

                      <div className="mb-8 md:mb-0 md:mr-[24px]">
                        <label htmlFor="maker" className="block text-[14px] mb-1 md:text-[16px] md:mb-2">メーカー</label>

                        <select name="maker" id="maker" onChange={(e) => { onChangeInputSearchMaker(e) }} className="border border-gray-300 rounded w-80 md:w-[250px] h-10 p-2 focus:outline-sub-green">
                          <option value="未選択" selected>未選択</option>
                          {makers?.map((maker) => (<option key={maker.id} value={maker.id}>{maker.name_ja}</option>))}
                        </select>
                      </div>

                      <div className="flex justify-end md:justify-start">
                        <button type="submit" className="text-white font-bold text-[14px] w-[160px] h-8 rounded  bg-sub-green md:text-[16px] md:self-end md:h-[40px] md:w-[100px]">検索する</button>
                      </div>
                    </form>

                    {/* 検索結果表示欄 */}
                    <div className="w-[100%] max-w-[320px] md:max-w-[768px]">
                      <p className="text-[14px] mb-[16px] md:text-[16px] md:max-w-[640px] md:mx-auto">検索結果</p>
                      <div className="flex justify-between flex-wrap w-[100%] max-w-[320px] md:max-w-[640px] md:mx-auto md:justify-start">
                        {/* ガット */}
                        {searchedGuts && searchedGuts.map(gut => (
                          <>
                            <div onClick={() => selectGut(gut)} className="flex  mb-6 hover:opacity-80 hover:cursor-pointer w-[100%] max-w-[360px] bg-white rounded-lg md:w-[100%] md:max-w-[360px]">
                              <div className="w-[120px] mr-6">
                                {gut.gut_image.file_path
                                  ? <img src={`${baseImagePath}${gut.gut_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                                  : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                                }
                              </div>

                              <div className="w-[100%] max-w-[160px] md:max-w-[216px]">
                                <p className="text-[14px] mb-2 md:text-[16px]">{gut.maker.name_ja}</p>
                                <p className="text-[16px] mb-2 md:text-[18px]">{gut.name_ja}</p>
                                <TextUnderBar className="w-[100%] max-w-[160px] md:max-w-[216px]" />
                              </div>
                            </div>
                          </>
                        ))}

                      </div>
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

export default MyEquipmentRegister;
