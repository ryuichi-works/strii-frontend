import type { RacketSeries } from "@/types/global";
import type { Maker, Racket } from "@/pages/users/[id]/profile";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useImageCrop } from "@/hooks/useImageCrop";
import { useImageFile } from "@/hooks/useImageFile";
import { AuthContext } from "@/context/AuthContext";

import Cookies from "js-cookie";
import axios from "@/lib/axios";
import SampleRacketImage from '../../public/sample_racket_image.jpeg';
import { baseImagePath } from "@/consts/global";

import Image from "next/image";
import { IoClose } from "react-icons/io5";
import ImageCropArea from "./ImageCropArea";
import SubHeading from "./SubHeading";


type RacketRegisterModalProps = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,

  // モーダルを閉じる時に呼び出し元で追加処理したい処理をメソッドとして渡す
  closeModalHandler?: any,

  makers?: Maker[],
  zIndexClassName?: string,
  racketSeries?: RacketSeries[],
  afterRegistringHandler?: any
}

const RacketRegisterModal: React.FC<RacketRegisterModalProps> = ({
  modalVisibility,
  setModalVisibility,
  closeModalHandler,
  zIndexClassName,
  makers,
  racketSeries,
  afterRegistringHandler
}) => {
  const [modalVisibilityClassName, setModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  const { user } = useContext(AuthContext);

  // makerごとにfilterをかけたラケットシリーズ
  const [filteredRacketSeries, setFilteredRacketSeries] = useState<RacketSeries[]>()

  //racket登録用のデータstate
  const [inputNameJa, setInputNameJa] = useState<string>('');
  const [inputNameEn, setInputNameEn] = useState<string>('');
  const [racketMakerId, setRacketMakerId] = useState<number | null>(null);
  const [racketSeriresId, setRacketSeriresId] = useState<number | null>(null);
  const [inputHeadSize, setInputHeadSize] = useState<number>(100);
  const [mainGutPattern, setMainGutPattern] = useState<string>('16');
  const [crossGutPattern, setCrossGutPattern] = useState<string>('19');
  const [racketWeight, setRacketWeight] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [agreement, setAgreement] = useState<boolean>(false);
  
  // useImageCropカスタムフックから取得
  const {
    crop,
    setCrop,
    rotation,
    setRotation,
    zoom,
    setZoom,
    croppedAreaPixels,
    setCroppedAreaPixels,
    croppedImage,
    setCroppedImage,
    croppedImageUrl,
    setCroppedImageUrl,
    onCropComplete,
    showCroppedImage,
  } = useImageCrop();
  // console.log('croppedImage', croppedImage);

  const {
    imageFileUrl,
    setImageFileUrl,
    changeImageFileToLocationUrl,
  } = useImageFile();

  const inputFileRef = useRef<HTMLInputElement>(null);

  // modalVisibility trueになった時にモーダルを開くため、開く動作はuseEffectで管理
  // コンポーネント外で開く処理を記述するのでこうなった
  useEffect(() => {
    if (modalVisibility) {
      setModalVisibilityClassName('opacity-100 scale-100');
    } else {
      setModalVisibilityClassName('opacity-0 scale-0');
    }
  }, [modalVisibility])

  // モーダルを閉じる時に挟みたい処理
  const closeModal = () => {
    setModalVisibility(false);
    setModalVisibilityClassName('opacity-0 scale-0')
    if (closeModalHandler) {
      closeModalHandler();
    }
  }

  // 登録後に挟みたい処理
  const afterRegistringHandle = (racket: Racket) => {
    afterRegistringHandler(racket);
    resetData();
  }

  const onChangeMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRacketSeriresId(null)

    if (e.target.value === '未選択') {
      setRacketMakerId(null);

      setFilteredRacketSeries(undefined)
      return
    };

    setRacketMakerId(Number(e.target.value));
    filterRacketSeriesByMaker(Number(e.target.value), racketSeries);
  }

  const onChangeRacketSeries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setRacketSeriresId(null);
      return
    };

    setRacketSeriresId(Number(e.target.value));
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

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    changeImageFileToLocationUrl(files);
  }

  const onChangeAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
    setAgreement(e.target.checked);
  }

  // 登録処理データの初期化関数
  const resetData = () => {
    setImageFileUrl('')
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
    setCrop({ x: 0, y: 0 })
    setRotation(0)
    setZoom(1)
    setCroppedAreaPixels(undefined)
    setCroppedImage(undefined)
    setCroppedImageUrl(undefined)
    setErrors(initialErrorVals)
    setInputNameJa('');
    setInputNameEn('');
    setRacketMakerId(null);
    setRacketSeriresId(null);
    setInputHeadSize(100);
    setMainGutPattern('16');
    setCrossGutPattern('19');
    setRacketWeight(null);
    setBalance(null);
    setAgreement(false);
  }

  //エラーメッセージ関連
  type Errors = {
    name_ja: string[],
    name_en: string[],
    maker_id: string[],
    need_posting_image: string[],
    posting_user_id: string[],
    series_id: string[],
    head_size: string[],
    pattern: string[],
    weight: string[],
    balance: string[],
    agreement: string[],
    file: string[],
    title: string[],
    limit: string[],
  }

  const initialErrorVals: Errors = {
    name_ja: [],
    name_en: [],
    maker_id: [],
    need_posting_image: [],
    posting_user_id: [],
    series_id: [],
    head_size: [],
    pattern: [],
    weight: [],
    balance: [],
    agreement: [],
    file: [],
    title: [],
    limit: [],
  };

  const [errors, setErrors] = useState<Errors>(initialErrorVals);

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const registerRacket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerData = {
      name_ja: inputNameJa,
      name_en: inputNameEn,
      maker_id: racketMakerId,
      // image_id: racketImageId,

      // multipart/form-dataの時はstring型になってしまうため変換
      need_posting_image: Number(false),
      posting_user_id: user.id,
      series_id: racketSeriresId ? racketSeriresId : null,
      head_size: inputHeadSize,
      pattern: `${mainGutPattern}/${crossGutPattern}`,
      weight: racketWeight,
      balance: balance,

      // multipart/form-dataの時はstring型になってしまうため変換
      agreement: Number(agreement),
      file: croppedImage,
      title: inputNameJa,
    }

    await csrf();

    await axios.post('api/rackets', registerData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
        'Content-Type': 'multipart/form-data;'
      }
    }).then(res => {
      console.log('ラケットを新規登録しました。');
      afterRegistringHandle(res.data);
      closeModal();
    }).catch((e) => {
      const newErrors = { ...initialErrorVals, ...e.response.data.errors };

      setErrors(newErrors);

      console.log('ラケットの登録に失敗しました');
    })
  }

  return (
    <>
      <div className={`bg-white w-screen h-screen fixed top-0 left-0 ${modalVisibilityClassName} duration-[400ms] pt-[24px] pb-[60px] overflow-y-scroll ${zIndexClassName}`}>
        <div className="flex flex-col items-center w-[100%] max-w-[320px] mx-auto md:max-w-[768px] overflow-y-auto">
          <div onClick={closeModal} className="self-end hover:cursor-pointer md:mr-[39px]">
            <IoClose size={48} />
          </div>

          <div className="w-[100%] max-w-[320px] md:max-w-[768px] mx-auto flex flex-col md:justify-center">
            <SubHeading
              text="ラケット登録"
              className="text-center mb-[32px] md:text-[20px]"
            />


            <form
              action=""
              onSubmit={(e) => registerRacket(e)}
              className="md:flex md:justify-center md:gap-[48px]"
            >
              {/* section_one */}
              <div>
                {/* カナ名入力 */}
                <div className="mb-6">
                  <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ラケット名(カナ) <span className="text-[14px] md:text-[16px] text-red-400">※必須</span></label>
                  <input
                    type="text"
                    name="name_ja"
                    onChange={(e) => setInputNameJa(e.target.value)}
                    value={inputNameJa}
                    className={`border border-gray-300 rounded w-80 md:w-[360px] h-10 p-2 focus:outline-sub-green ${errors.name_ja.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                  />
                  {errors.name_ja.length !== 0 &&
                    errors.name_ja.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                  }
                </div>

                {/* アルファベット名入力 */}
                <div className="mb-6">
                  <label htmlFor="name_en" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ラケット名(アルファベット)</label>
                  <input
                    type="text"
                    name="name_en"
                    onChange={(e) => setInputNameEn(e.target.value)}
                    value={inputNameEn}
                    className={`border border-gray-300 rounded w-80 md:w-[360px] h-10 p-2 focus:outline-sub-green ${errors.name_en.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                  />
                  {errors.name_en.length !== 0 &&
                    errors.name_en.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                  }
                </div>

                {/* メーカー入力 */}
                <div className=" mb-8">
                  <label htmlFor="maker" className="block text-[14px] md:text-[16px]">メーカー<span className="text-[14px] md:text-[16px] text-red-400"> ※必須</span></label>

                  <select
                    name="maker"
                    id="maker"
                    onChange={(e) => { onChangeMaker(e) }}
                    value={racketMakerId ? String(racketMakerId) : '未選択'}
                    className={` border border-gray-300 rounded w-80 md:w-[360px] h-10 p-2 focus:outline-sub-green ${errors.maker_id.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                  >
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
                    value={racketSeriresId ? String(racketSeriresId) : '未選択'}
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
                  <label htmlFor="head_size" className="block text-[14px] md:text-[16px]">ヘッドサイズ<span className="text-[14px] md:text-[16px] text-red-400"> ※必須</span></label>
                  <input
                    type="number"
                    name="head_size"
                    onChange={onChangeHeadSize}
                    min="77"
                    max="150"
                    value={inputHeadSize}
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
                    <span className="text-[14px] md:text-[16px] text-red-400"> ※必須</span>
                  </label>
                  <input
                    type="number"
                    name="main_pattern"
                    onChange={(e) => onChangeGutPattern(e, 'main')}
                    min="11"
                    max="24"
                    value={mainGutPattern}
                    className={`text-center border border-gray-300 rounded w-14 h-10 p-2 focus:outline-sub-green ${errors.pattern.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                  />
                  <span className="mx-2 text-[14px] md:text-[16px]">/</span>
                  <input
                    type="number"
                    name="cross_pattern"
                    onChange={(e) => onChangeGutPattern(e, 'cross')}
                    min="11"
                    max="24"
                    value={crossGutPattern}
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
                    value={racketWeight ? racketWeight : ''}
                    placeholder="半角数字"
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
                    value={balance ? balance : ''}
                    placeholder="半角数字"
                    className={`border border-gray-300 rounded w-40 h-10 p-2 focus:outline-sub-green ${errors.balance.length !== 0 ? '!border-red-300 focus:!outline-red-500' : null}`}
                  />
                  <span className="ml-4 md:text-[16px]">mm</span>

                  {errors.balance.length !== 0 &&
                    errors.balance.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                  }
                </div>
              </div>


              {/* section_two */}
              <div>
                {/* ラケットイメージ選択 */}
                <div className="mb-[24px]">
                  {/* ファイル選択 */}
                  <div className="flex flex-col mb-[16px]">
                    <label htmlFor="gut_image_file" className="text-[14px] mb-1 md:text-[16px] md:mb-2">ラケット画像<span className="text-[14px] md:text-[16px] text-red-400"> ※必須</span></label>
                    <input
                      type="file"
                      name="gut_image_file"
                      accept=".jpg, .jpeg, .png"
                      onChange={onChangeFile}
                      ref={inputFileRef} className="h-8"
                    />
                    {errors.file.length !== 0 &&
                      errors.file.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  {/* トリミングエリア */}
                  <div className="mb-6 ">
                    <div className="mb-[32px]">
                      <p className="text-[14px] mb-[8px] md:text-[16px] md:mb-[16px]">構図</p>

                      <div className="w-[320px] mb-[20px] md:w-[360px]">
                        <ul className="text-[14px] md:text-[16px]">
                          <li className="mb-1 md:mb-2">・壁に立てかける、または床に寝かせた状態</li>
                          <li className="mb-1 md:mb-2">・方向は縦</li>
                          <li className="mb-1 md:mb-2">・ラケットの上端付近からグリップの上端付近までを収める</li>
                        </ul>
                      </div>

                      <div className="flex justify-between">
                        <div className="w-[120px]">
                          <p className="mb-2 md:text-[16px]">※ 見本</p>
                          <Image
                            src={SampleRacketImage}
                            alt="sample racket image"
                            className="w-[120px] h-[160px]"
                          />
                        </div>
                        <p className="w-[170px] pt-[32px] md:text-[16px] md:w-[216px]">注）画像は投稿主本人が撮影、所有している必要があります。</p>
                      </div>
                    </div>

                    <div className="border-t rounded min-h-[40px] w-[100%] max-w-[320px] md:max-w-[360px]">
                      {imageFileUrl && (
                        <>
                          <p className="text-[14px] mb-2 md:text-[16px]">画像トリミング</p>
                          <ImageCropArea
                            imageFileUrl={imageFileUrl}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            aspect={3 / 4}
                            setCrop={setCrop}
                            setRotation={setRotation}
                            setZoom={setZoom}
                            onCropComplete={onCropComplete}
                            showCroppedImage={showCroppedImage}
                            zoomMin={1}
                            zoomMax={3}
                            zoomStep={0.05}
                            rotationMin={0}
                            rotationMax={360}
                            rotationStep={0.5}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="md:flex justify-between items-start md:w-[100%] md:max-w-[360px] ">
                    {/* プレビュー */}
                    <div className="">
                      {croppedImageUrl && (
                        <>
                          <p className="text-[14px] mb-1 md:text-[16px] md:mb-2">プレビュー</p>
                          <img src={croppedImageUrl} alt="" className="w-[100%] max-w-[120px]" />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* ラケット登録規約確認 */}
                <div className={`mb-[40px] ${!croppedImage && 'opacity-40'}`}>
                  <p className="text-[14px] md:text-[16px]">画像は投稿主、本人が撮影、所有しているものですか。</p>
                  <p className="text-center">
                    <input
                      type="checkbox"
                      name="agreement"
                      id="agreement"
                      onChange={(e) => { onChangeAgreement(e) }}
                      disabled={croppedImage ? false : true}
                      checked={agreement}
                      className="mr-1"
                    />
                    <label htmlFor="agreement" className="md:text-[16px]">はい</label>
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    type="submit"
                    className={`text-white font-bold text-[14px] w-[200px] h-8 rounded bg-sub-green ${!agreement && 'opacity-50'} md:text-[16px]`}
                    disabled={!agreement}
                  >登録</button>

                  {/* エラー一覧表示 */}
                  <div>
                    {errors.name_ja.length !== 0 &&
                      errors.name_ja.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.name_en.length !== 0 &&
                      errors.name_en.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.maker_id.length !== 0 &&
                      errors.maker_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.head_size.length !== 0 &&
                      errors.head_size.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.pattern.length !== 0 &&
                      errors.pattern.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.weight.length !== 0 &&
                      errors.weight.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.balance.length !== 0 &&
                      errors.balance.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.file.length !== 0 &&
                      errors.file.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                    {errors.limit.length !== 0 &&
                      errors.limit.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}

export default RacketRegisterModal;
