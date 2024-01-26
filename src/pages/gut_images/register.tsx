import type { NextPage } from "next";

import axios from "@/lib/axios";
import Cookies from "js-cookie";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import { type Maker } from "../users/[id]/profile";
import FlashMessage from "@/components/FlashMessage";
import ImageCropArea from "@/components/ImageCropArea";

import { useImageCrop } from "@/hooks/useImageCrop";
import { useImageFile } from "@/hooks/useImageFile";

const GutImageRegister: NextPage = () => {
  const router = useRouter();

  const { isAuth, user, isAuthAdmin } = useContext(AuthContext);

  const [title, setTitle] = useState<string>('');

  const [makers, setMakers] = useState<Maker[]>();

  const [selectedMakerId, setSelectedMakerId] = useState<number>();

  const inputFileRef = useRef<HTMLInputElement>(null);

  // flassメッセージの表示関連stateとuseEffect
  const [showingFlashMessage, setShowingFlashMessage] = useState<boolean>(false);
  const [showingFlashMessageStyle, setShowingFlashMessageStyle] = useState<string>('bottom-[-100%]')

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

  const {
    imageFileUrl,
    setImageFileUrl,
    changeImageFileToLocationUrl,
  } = useImageFile();

  // 下記の2つのuseEffectによりflashメッセージを表示切り替え
  // 依存配列のstateを同じuseEffect内で書き換えるこのができないため2つのuseEffectを使用して実装
  useEffect(() => {
    let timeOutId: NodeJS.Timeout | null = null;

    if (showingFlashMessage) {
      timeOutId = setTimeout(() => {
        setShowingFlashMessageStyle('bottom-[-100%]');

      }, 3500);
    }

    return () => {
      if (timeOutId) clearTimeout(timeOutId);
    }
  }, [showingFlashMessage])

  useEffect(() => {
    if (showingFlashMessageStyle === 'bottom-[-100%]') {
      setShowingFlashMessage(false);
    }
  }, [showingFlashMessageStyle])

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    changeImageFileToLocationUrl(files);
  }

  const onChangeSelectMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setSelectedMakerId(undefined);

      return
    }

    setSelectedMakerId(Number(e.target.value));
  }

  useEffect(() => {
    const getMakerList = async () => {
      await axios.get('api/makers').then(res => {
        setMakers(res.data);
      })
    }

    getMakerList();
  }, [])

  type Errors = {
    title: string[],
    file: string[],
    maker_id: string[]
  }

  const [errors, setErrors] = useState<Errors>({ title: [], file: [], maker_id: [] });

  // 登録処理データの初期化関数
  const resetData = () => {
    setTitle('')
    setImageFileUrl('')
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
    setSelectedMakerId(undefined)
    setCrop({ x: 0, y: 0 })
    setRotation(0)
    setZoom(1)
    setCroppedAreaPixels(undefined)
    setCroppedImage(undefined)
    setCroppedImageUrl(undefined)
    setErrors({ title: [], file: [], maker_id: [] })
  }

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const uploadGutImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerData = {
      file: croppedImage,
      title: title,
      maker_id: selectedMakerId
    }

    await csrf();

    await axios.post('api/gut_images', registerData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
        'Content-Type': 'multipart/form-data;'
      }
    }).then(async (res) => {
      console.log('ストリング画像を登録しました');

      resetData();

      setShowingFlashMessage(true)

      setShowingFlashMessageStyle('bottom-0')
    }).catch((e) => {
      console.log(e);
      const newErrors = { title: [], file: [], maker_id: [], ...e.response.data.errors };
      setErrors(newErrors);

      console.log('基本プロフィール更新に失敗しました。');
    })
  }

  return (
    <>
      <AuthCheck>
        {(isAuth || isAuthAdmin) && (
          <>
            <div className="container mx-auto mb-[48px]">
              <FlashMessage
                flashMessage={'画像提供受付ました、ご協力ありがとうございます。'}
                flashType="success"
                className={`fixed ${showingFlashMessageStyle} left-[50%] translate-x-[-50%] mb-2 duration-1000`}
              />

              <div className="text-center my-6 md:my-[32px]">
                <PrimaryHeading text="ストリング画像登録" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div>
                <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[380px]">
                  <form action="" onSubmit={uploadGutImage}>
                    <div className="mb-6">
                      <label htmlFor="title" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">画像タイトル</label>
                      <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} value={title} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                      {errors.title.length !== 0 &&
                        errors.title.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="mb-8 md:mb-6 md:mr-[24px]">
                      <label htmlFor="maker" className="block text-[14px] mb-1 md:text-[16px] md:mb-2">メーカー</label>

                      <select
                        name="maker"
                        id="maker"
                        onChange={onChangeSelectMaker}
                        value={String(selectedMakerId)}
                        className="border border-gray-300 rounded w-[160px] md:w-[250px] h-10 p-2 focus:outline-sub-green"
                      >
                        <option value={undefined} selected>未選択</option>
                        {makers?.map((maker) => (<option key={maker.id} value={maker.id}>{maker.name_ja}</option>))}
                      </select>
                      {errors.maker_id.length !== 0 &&
                        errors.maker_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="flex flex-col mb-6">
                      <label htmlFor="gut_image_file" className="text-[14px] mb-1 md:text-[16px] md:mb-2">画像ファイル</label>
                      <input type="file" name="gut_image_file" accept=".jpg, .jpeg, .png" onChange={onChangeFile} ref={inputFileRef} className="h-8" />
                      {errors.file.length !== 0 &&
                        errors.file.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    {/* トリミングエリア */}
                    <div className="mb-6 ">
                      <p>画像トリミング</p>
                      <div className="border-t rounded min-h-[40px] w-[100%] max-w-[320px] md:max-w-[380px]">

                        {imageFileUrl && (
                          <>
                            <ImageCropArea
                              imageFileUrl={imageFileUrl}
                              crop={crop}
                              rotation={rotation}
                              zoom={zoom}
                              aspect={1 / 1}
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

                    <div className="md:flex justify-between items-start md:w-[100%] md:max-w-[380px] ">
                      {/* プレビュー */}
                      <div className="mb-[64px] md:mb-0">
                        {croppedImageUrl && (
                          <>
                            <p className="text-[14px] mb-1 md:text-[16px] md:mb-2">プレビュー</p>
                            <img src={croppedImageUrl} alt="" className="w-[100%] max-w-[160px] md:max-w-[180px]" />
                          </>
                        )}
                      </div>


                      <div className="flex justify-center md:mt-[32px]">
                        {croppedImage && (
                          <>
                            <div>
                              <button type="submit" className="text-white text-[14px] w-[200px] h-8 rounded  bg-sub-green md:w-[150px] md:text-[16px] md:block md:ml-auto">画像を追加する</button>
                              {errors.title.length !== 0 &&
                                errors.title.map((message, i) => <p key={i} className="text-red-400 mt-2">{message}</p>)
                              }
                              {errors.file.length !== 0 &&
                                errors.file.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                              }
                              {errors.maker_id.length !== 0 &&
                                errors.maker_id.map((message, i) => <p key={i} className="text-red-400 mt-2">{message}</p>)
                              }
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </AuthCheck >
    </>
  );
}

export default GutImageRegister;
