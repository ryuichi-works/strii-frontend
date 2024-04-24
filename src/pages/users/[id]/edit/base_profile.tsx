import type { NextPage } from "next";
import type { User } from "@/context/AuthContext";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Head from 'next/head';
import AuthCheck from "@/components/AuthCheck";
import ImageCropArea from "@/components/ImageCropArea";

import { useImageCrop } from "@/hooks/useImageCrop";
import { useImageFile } from "@/hooks/useImageFile";

const BaseProfileEdit: NextPage = () => {
  const router = useRouter();

  const { isAuth, user, setUser, setIsAuth } = useContext(AuthContext);

  //基本プロフィール変更用state
  const [name, setName] = useState<string>(`${user.name}`);
  const [email, setEmail] = useState<string>(`${user.email}`);

  //password変更用state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  const inputFileRef = useRef<HTMLInputElement>(null);

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

  //エラー表示関連
  type Errors = {
    name: string[],
    email: string[],
    file: string[],
    password: string[],
    current_password: string[],
  }

  const initialErrors: Errors = {
    name: [],
    email: [],
    file: [],
    password: [],
    current_password: [],
  }

  const [errors, setErrors] = useState<Errors>(initialErrors);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    changeImageFileToLocationUrl(files)
  }

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  // 基本プロフィール更新処理
  const updateBaseProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = {
      _method: 'PUT',
      name: name,
      email: email,
      file: croppedImage,
    }

    await csrf();

    await axios.post(`/api/users/${user.id}`, updatedData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
        'Content-Type': 'multipart/form-data;'
      }
    }).then(async (res) => {
      await axios.get('/api/user').then(res => {

        const user: User = res.data;

        setUser(user);

        setIsAuth(true);

        router.push(`/users/${user.id}/profile`);
      })
    }).catch((e) => {
      console.log(e);
      const newErrors = { ...initialErrors, ...e.response.data.errors };
      setErrors(newErrors);

      console.log('基本プロフィール更新に失敗しました。');
    })
  }

  // 画像登録処理データの初期化関数
  const resetImageFile = () => {
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
  }

  // password更新処理
  const passwordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = {
      _method: 'PUT',
      current_password: currentPassword,
      password: password,
      password_confirmation: passwordConfirmation
    }

    await csrf();

    await axios.post('users/password-update', updatedData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(async (res) => {
      console.log('パスワードを更新しました。');

      router.push(`/users/${user.id}/profile`);
    }).catch((e) => {
      console.log(e);
      const newErrors = { ...initialErrors, ...e.response.data.errors };
      setErrors(newErrors);

      console.log('パスワード更新に失敗しました。');
    })
  }

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <Head>
              <title>strii(ストリー) - 基本プロフィール編集</title>
            </Head>

            {/* <h1>プロフィールページ</h1> */}
            <div className="container mx-auto">
              <div className="w-80 mt-[24px] md:w-[500px] mx-auto flex flex-col md:justify-center md:mt-[48px]">
                <div className="w-[320px] md:w-[500px] mb-16">
                  <h2 className="text-xl">基本プロフィール</h2>
                  <hr className=" border-sub-green mb-6" />

                  <div className="w-16 md:w-20 mx-auto mb-4">
                    <div className="w-[64px] h-[64px] border rounded-full overflow-hidden mb-2 md:w-[80px] md:h-[80px]">
                      {user.file_path
                        ? <img src={`${user.file_path}`} alt="ユーザープロフィール画像" className=" w-[64px] md:w-[80px] h-[64px] md:h-[80px]" />
                        : <img src={`${baseImagePath}images/users/defalt_user_image.png`} width="64px" height="64px" alt="ユーザープロフィール画像" className="w-[64px] md:w-[80px] h-[64px] md:h-[80px]" />
                      }
                    </div>
                    <div className="w-8 h-1 bg-sub-green mx-auto"></div>
                  </div>

                  <form onSubmit={updateBaseProfile}>
                    <div className="flex flex-col mb-6">
                      <label htmlFor="">プロフィール画像</label>
                      <input type="file" name="file" accept=".jpg, .jpeg, .png" onChange={onChangeFile} ref={inputFileRef} className=" h-8" />
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

                            {/* プレビュー */}
                            <div className="mb-[64px] md:mb-0">
                              <div>
                                {croppedImageUrl && (
                                  <>
                                    <p className="text-[14px] mb-1 md:text-[16px] md:mb-2">プレビュー</p>

                                    <div className="flex justify-between mb-14">
                                      <img src={croppedImageUrl} alt="" className="w-[100%] max-w-[160px] md:max-w-[180px] rounded-full" />

                                      <button
                                        className="text-white text-[14px] w-[80px] h-8 rounded  bg-sub-green mt-auto"
                                        onClick={resetImageFile}
                                      >リセット</button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="name" className="block">アカウント名</label>
                      <input type="text" name="name" defaultValue={user.name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                      {errors.name && errors.name.length !== 0 &&
                        errors.name.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="email" className="block">メールアドレス</label>
                      <input type="email" name="email" defaultValue={user.email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                      {errors.email.length !== 0 &&
                        errors.email.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="flex justify-end md:justify-start">
                      <button type="submit" className="text-white text-[14px] w-[192px] h-8 rounded  bg-sub-green">基本プロフィールを変更する</button>
                    </div>
                  </form>
                </div>

                <div className="w-[320px] md:w-[500px]">
                  <h2 className="text-xl">パスワード変更</h2>
                  <hr className=" border-sub-green mb-6" />

                  <form action="" onSubmit={passwordUpdate}>
                    <div className="mb-6">
                      <label
                        htmlFor="current_password"
                        className="block"
                      >現在のパスワード</label>

                      <input
                        type="password"
                        name="current_password"
                        id="current_password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green"
                      />
                      {errors.current_password.length !== 0 &&
                        errors.current_password.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="password"
                        className="block"
                      >新しいパスワード</label>

                      <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green"
                      />
                      {errors.password.length !== 0 &&
                        errors.password.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div>
                      <label
                        htmlFor="password_confirmation"
                        className="block"
                      >新しいパスワード確認</label>

                      <input
                        type="password"
                        name="password_confirmation"
                        id="password_confirmation"
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green mb-8"
                      />
                    </div>

                    <div className="flex justify-end md:justify-start">
                      <button
                        type="submit"
                        className="text-white text-[14px] w-[160px] h-8 rounded  bg-sub-green"
                      >パスワードを変更する</button>
                    </div>
                  </form>
                </div>

                {/* <div className="w-[320px] md:ml-[32px]">

                </div> */}
              </div>
            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default BaseProfileEdit;
