import type { NextPage } from "next";
import type { Maker, Racket } from "@/pages/users/[id]/profile";
import type { RacketImage } from "@/pages/users/[id]/profile";
import type { RacketSeries } from "@/types/global";

import axios from "@/lib/axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

import AuthAdminCheck from "@/components/AuthAdminCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import { IoClose } from "react-icons/io5";
import Pagination, { Paginator } from "@/components/Pagination";

const RacketEdit: NextPage = () => {
  const router = useRouter();

  const id = router.query.id;

  const { admin, isAuthAdmin, } = useContext(AuthContext);

  // 表示に関連するstate
  const [currentRacket, setCurrentRacket] = useState<Racket>();
  const [racketSeries, setRacketSeries] = useState<RacketSeries[]>();
  const [makers, setMakers] = useState<Maker[]>();

  //racket登録用のデータstate
  const [inputNameJa, setInputNameJa] = useState<string>('');
  const [inputNameEn, setInputNameEn] = useState<string>('');
  const [racketMakerId, setRacketMakerId] = useState<number | null>();
  const [needPostingImage, setNeedPostingImage] = useState<boolean>();
  const [racketImageId, setRacketImageId] = useState<number>();
  const [racketSeriresId, setRacketSeriresId] = useState<number | null>(null);
  const [inputHeadSize, setInputHeadSize] = useState<number>();
  const [mainGutPattern, setMainGutPattern] = useState<string>();
  const [crossGutPattern, setCrossGutPattern] = useState<string>();
  const [racketWeight, setRacketWeight] = useState<number | null>();
  const [balance, setBalance] = useState<number | null>();
  const [selectedRacketImage, setSelectedRacketImage] = useState<RacketImage>();

  //ラケット画像検索関連のstate
  const [inputSearchWord, setInputSearchWord] = useState<string>('');
  const [inputSearchMaker, setInputSearchMaker] = useState<number | null>();
  const [searchedRacketImages, setSearchedRacketImages] = useState<RacketImage[]>();

  // イメージ検索モーダル内のページネーター
  const [racketImagesPaginator, setRacketImagesPaginator] = useState<Paginator<RacketImage>>();

  // makerごとにfilterをかけたラケットシリーズ
  const [filteredRacketSeries, setFilteredRacketSeries] = useState<RacketSeries[]>()

  //モーダルの開閉に関するstate
  const [modalVisibilityClassName, setModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  useEffect(() => {
    const getMakerList = async () => {
      await axios.get('api/makers').then(res => {
        setMakers(res.data);
      })
    }

    const getCurrentRacket = async () => {
      await axios.get(`api/rackets/${id}`).then(res => {
        const racket: Racket = res.data;

        setCurrentRacket(racket);
        setInputNameJa(racket.name_ja);
        setInputNameEn(racket.name_en);
        setRacketMakerId(racket.maker_id);
        setNeedPostingImage(!!racket.need_posting_image);
        setRacketImageId(racket.image_id);
        setRacketSeriresId(racket.series_id);
        setInputHeadSize(racket.head_size);

        // ストリングパターンをバラす（例: '16/19' => '16', '19'）
        const splitedPatturn: string[] = racket.pattern.split('/');

        setMainGutPattern(splitedPatturn[0]);
        setCrossGutPattern(splitedPatturn[1]);
        if (racket.weight) setRacketWeight(racket.weight);
        if (racket.balance) setBalance(racket.balance);
      })
    }

    const getRacketSeries = async () => {
      await axios.get('api/racket_series').then(res => {
        setRacketSeries(res.data);
      })
    }

    getMakerList();
    getRacketSeries();
    getCurrentRacket();
  }, [])

  // ラケットシリーズの絞り込み（edit画面初期表示のため）
  useEffect(() => {
    if (currentRacket) {
      filterRacketSeriesByMaker(currentRacket.maker_id, racketSeries)
      console.log('確認')
    }
  }, [currentRacket])

  const onChangeMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setRacketSeriresId(null)
      setRacketMakerId(null);

      setFilteredRacketSeries(undefined)
      return
    };

    setRacketMakerId(Number(e.target.value));
    filterRacketSeriesByMaker(Number(e.target.value), racketSeries);
  }

  const onChangeInputSearchMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setInputSearchMaker(null);
      return
    };

    setInputSearchMaker(Number(e.target.value));
  }

  const onChangeRacketSeries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setRacketSeriresId(null);
      return
    };

    setRacketSeriresId(Number(e.target.value));
  }

  const onChangeHeadSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputHeadSize(Number(e.target.value));
  }

  const onChangeGutPattern = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'cross') => {
    switch (type) {
      case 'main':
        setMainGutPattern(e.target.value);
        break;
      case 'cross':
        setCrossGutPattern(e.target.value);
        break;
    }
  }

  const onChangeRacketWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRacketWeight(Number(e.target.value));
  }

  const onChangeBalance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalance(Number(e.target.value));
  }

  // makerごとのracketシリーズにフィルタリング
  const filterRacketSeriesByMaker = (makerId: number, racketSeries?: RacketSeries[]) => {

    const filteredSeries = racketSeries?.filter(series => {
      return series.maker_id === makerId
    })

    if (filteredSeries) {
      setFilteredRacketSeries(filteredSeries);
    }
  }

  //モーダルの開閉
  const closeModal = () => {
    setModalVisibilityClassName('opacity-0 scale-0')
  }

  const openModal = () => {
    setModalVisibilityClassName('opacity-100 scale-100')
  }

  //エラーメッセージ関連
  type Errors = {
    name_ja: string[],
    name_en: string[],
    maker_id: string[],
    image_id: string[],
    series_id: string[],
    head_size: string[],
    pattern: string[],
    weight: string[],
    balance: string[],

  }

  const initialErrorVals = {
    name_ja: [],
    name_en: [],
    maker_id: [],
    image_id: [],
    series_id: [],
    head_size: [],
    pattern: [],
    weight: [],
    balance: [],
  };

  const [errors, setErrors] = useState<Errors>(initialErrorVals);

  //ページネーションを考慮した検索後racketImage一覧データの取得関数
  const getSearchedRacketImagesList = async (url: string = `api/racket_images/search?several_words=${inputSearchWord}&maker=${inputSearchMaker ? inputSearchMaker : ''}`) => {
    await axios.get(url).then((res) => {
      setRacketImagesPaginator(res.data);

      setSearchedRacketImages(res.data.data);
    })
  }

  //racketImage検索
  const searchRacketImages = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      getSearchedRacketImagesList();

      console.log('検索完了しました')
    } catch (e) {
      console.log(e);
    }
  }

  // 画像検索モーダルによる画像変更
  const selectImage = (racketImage: RacketImage) => {
    setSelectedRacketImage(racketImage);
    setRacketImageId(racketImage.id);
    closeModal();
  }

  //racket更新処理関連
  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const updateRacket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 更新用データ
    const udpatedData = {
      _method: 'PUT',
      name_ja: inputNameJa,
      name_en: inputNameEn,
      maker_id: racketMakerId,
      image_id: racketImageId,
      need_posting_image: needPostingImage,
      series_id: racketSeriresId ? racketSeriresId : null,
      head_size: inputHeadSize,
      pattern: (mainGutPattern && crossGutPattern) ? `${mainGutPattern}/${crossGutPattern}` : '',
      weight: racketWeight ? racketWeight : null,
      balance: balance ? balance : null,
    }

    await csrf();

    await axios.post(`api/rackets/${currentRacket?.id}`, udpatedData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(res => {
      console.log('ラケット情報を更新しました。');

      router.push(`/rackets/${currentRacket?.id}`);
    }).catch((e) => {
      const newErrors = { ...initialErrorVals, ...e.response.data.errors };

      setErrors(newErrors);

      console.log('ラケット情報の更新に失敗しました');
    })
  }

  return (
    <>
      <AuthAdminCheck>
        {isAuthAdmin && (
          <>

            <div className="container mx-auto mb-8 w-screen overflow-y-auto">

              <div className="text-center my-6 md:my-[32px]">
                <PrimaryHeading text="ラケット情報更新" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="w-[100%] max-w-[320px] md:max-w-[380px] mx-auto flex flex-col md:justify-center">
                <form action="" onSubmit={(e) => updateRacket(e)}>
                  {/* カナ名入力 */}
                  <div className="mb-6">
                    <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ラケット名(カナ)</label>
                    <input type="text" name="name_ja" onChange={(e) => setInputNameJa(e.target.value)} defaultValue={currentRacket?.name_ja} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    {errors.name_ja.length !== 0 &&
                      errors.name_ja.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  {/* アルファベット名入力 */}
                  <div className="mb-6">
                    <label htmlFor="name_en" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ラケット名(アルファベット)</label>
                    <input type="text" name="name_en" onChange={(e) => setInputNameEn(e.target.value)} defaultValue={currentRacket?.name_en} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    {errors.name_en.length !== 0 &&
                      errors.name_en.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  {/* メーカー入力 */}
                  <div className=" mb-8">
                    <label htmlFor="maker" className="block text-[14px] md:text-[16px]">メーカー</label>
                    <select name="maker" id="maker" onChange={(e) => { onChangeMaker(e) }} value={racketMakerId ? racketMakerId : '未選択'} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                      <option value="未選択" selected>未選択</option>
                      {makers?.map((maker) => (<option key={maker.id} value={maker.id}>{maker.name_ja}</option>))}
                    </select>

                    {errors.maker_id.length !== 0 &&
                      errors.maker_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  {/* ラケットシリーズ入力 */}
                  <div className=" mb-8">
                    <label htmlFor="series" className="block text-[14px] md:text-[16px]">シリーズ</label>
                    <select
                      name="series"
                      id="series"
                      onChange={(e) => { onChangeRacketSeries(e) }}
                      value={racketSeriresId ? racketSeriresId.toString() : '未選択'}
                      className={`border border-gray-300 rounded w-80 md:w-[360px] h-10 p-2 focus:outline-sub-green ${errors.series_id.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                    >
                      <option value="未選択" selected>未選択</option>
                      {filteredRacketSeries?.map((series) => (<option key={series.id} value={series.id}>{series.name_ja}</option>))}
                    </select>

                    {errors.series_id.length !== 0 &&
                      errors.series_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  {/* ヘッドサイズ入力 */}
                  <div className="mb-6">
                    <label htmlFor="head_size" className="block text-[14px] md:text-[16px]">ヘッドサイズ</label>
                    <input
                      type="number"
                      name="head_size"
                      onChange={onChangeHeadSize}
                      min="77"
                      max="150"
                      defaultValue={inputHeadSize}
                      className={`border border-gray-300 rounded w-40 h-10 p-2 focus:outline-sub-green ${errors.head_size.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                    />
                    <span className="ml-4 text-[14px] md:text-[16px]">平方インチ</span>

                    {errors.head_size.length !== 0 &&
                      errors.head_size.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  {/* ストリングパターン入力 */}
                  <div className="mb-6">
                    <label htmlFor="gut_pattern" className="block text-[14px] md:text-[16px]">
                      ストリングパターン
                      <span className="text-[12px] md:text-[14px]">（メイン / クロス）</span>
                    </label>
                    <input
                      type="number"
                      name="main_pattern"
                      onChange={(e) => onChangeGutPattern(e, 'main')}
                      min="11"
                      max="24"
                      defaultValue={mainGutPattern}
                      className={`text-center border border-gray-300 rounded w-14 h-10 p-2 focus:outline-sub-green`}
                    />
                    <span className="mx-2 text-[14px] md:text-[16px]">/</span>
                    <input
                      type="number"
                      name="cross_pattern"
                      onChange={(e) => onChangeGutPattern(e, 'cross')}
                      min="11"
                      max="24"
                      defaultValue={crossGutPattern}
                      className={`text-center border border-gray-300 rounded w-14 h-10 p-2 focus:outline-sub-green ${errors.pattern.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                    />

                    {errors.pattern.length !== 0 &&
                      errors.pattern.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  {/* ラケット重量入力 */}
                  <div className="mb-6">
                    <label htmlFor="racket_weight" className="block text-[14px] md:text-[16px]">重さ</label>
                    <input
                      type="number"
                      name="racket_weight"
                      onChange={onChangeRacketWeight}
                      min="0"
                      max="500"
                      defaultValue={racketWeight ? racketWeight : ''}
                      className={`border border-gray-300 rounded w-40 h-10 p-2 focus:outline-sub-green ${errors.weight.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                    />
                    <span className="ml-4 md:text-[16px]">g</span>

                    {errors.weight.length !== 0 &&
                      errors.weight.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  {/* バランスポイント入力 */}
                  <div className="mb-6">
                    <label htmlFor="balance" className="block text-[14px] md:text-[16px]">バランスポイント</label>
                    <input
                      type="number"
                      name="balance"
                      onChange={onChangeBalance}
                      min="0"
                      max="400"
                      defaultValue={balance ? balance : undefined}
                      className={`border border-gray-300 rounded w-40 h-10 p-2 focus:outline-sub-green ${errors.balance.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                    />
                    <span className="ml-4 md:text-[16px]">mm</span>

                    {errors.balance.length !== 0 &&
                      errors.balance.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  <div className="mb-6">
                    <label htmlFor="need_posting_image" className="text-[14px] mr-1 md:text-[16px]">画像提供受付</label>
                    <input type="checkbox" name="need_posting_image" id="need_posting_image" checked={needPostingImage} onChange={(e) => setNeedPostingImage(e.target.checked)} className="align-middle" />
                  </div>

                  {/* 画像選択 */}
                  <div className="mb-[64px] md:w-[100%] md:max-w-[380px]">
                    <input type="hidden" name="image_id" />

                    <div className="md:w-[100%] md:max-w-[380px]">
                      <p className="mb-2 text-[14px] md:text-[16px]">選択中：{selectedRacketImage ? selectedRacketImage.title : `${currentRacket?.racket_image.title}`}</p>
                      <div className="flex justify-between md:w-[100%] md:max-w-[380px]">
                        <div className="self-end">
                          <button type="button" onClick={openModal} className="text-white font-bold text-[14px] w-[80px] h-6 rounded  bg-sub-green">選ぶ</button>
                        </div>

                        <div className="w-[100%] max-w-[200px] h-[160px] flex justify-center md:justify-end">
                          {selectedRacketImage && <img src={`${baseImagePath}${selectedRacketImage?.file_path}`} alt="" className="w-[100%] max-w-[120px] h-[160px] border" />}
                          {(currentRacket?.racket_image && !selectedRacketImage) && <img src={`${baseImagePath}${currentRacket?.racket_image.file_path}`} alt="" className="w-[100%] max-w-[120px] h-[160px] border " />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button type="submit" className="text-white font-bold text-[14px] w-[200px] h-8 rounded  bg-sub-green">更新する</button>
                  </div>
                </form>
              </div>

              {/* 検索モーダル */}
              <div className={`bg-gray-300 w-screen min-h-screen absolute top-[64px] left-0 ${modalVisibilityClassName} duration-[400ms] pt-[24px] overflow-y-auto`}>
                <div className="flex flex-col items-center w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">
                  <div onClick={closeModal} className="self-end hover:cursor-pointer md:mr-[39px]">
                    <IoClose size={48} />
                  </div>

                  <form action="" onSubmit={searchRacketImages} className="mb-[24px] md:flex md:mb-[40px]">
                    <div className="mb-6 md:mb-0 md:mr-[16px]">
                      <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">画像 検索ワード</label>
                      <input type="text" name="name_ja" onChange={(e) => setInputSearchWord(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[300px] h-10 p-2 focus:outline-sub-green" />
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
                      {searchedRacketImages?.map(racketImage => (
                        <>
                          {/* ガット画像情報カード */}
                          <div onClick={() => selectImage(racketImage)} className="bg-white p-2 rounded-lg w-[100%] max-w-[136px] hover:opacity-80 mb-6 hover:cursor-pointer md:[&:not(:last-child)]:mr-[24px]">
                            <div className="w-[120px] mb-2">
                              {racketImage.file_path && <img src={`${baseImagePath}${racketImage.file_path}`} alt="ストリング画像" className="w-[120px] h-[160px]" />}
                            </div>

                            <p className="text-[14px] mb-1 md:text-[16px]">{racketImage.maker.name_ja}</p>

                            <p className="text-[14px] md:text-[16px]">{racketImage.title}</p>
                          </div>
                        </>
                      ))}
                    </div>

                    <Pagination
                      paginator={racketImagesPaginator}
                      paginate={getSearchedRacketImagesList}
                      className="mt-[32px] mb-[32px] md:mt-[48px] md:mb-[48px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </AuthAdminCheck>
    </>
  );
}

export default RacketEdit;

