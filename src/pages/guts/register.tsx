import type { Maker } from "../users/[id]/profile";

import AuthAdminCheck from "@/components/AuthAdminCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import { AuthContext } from "@/context/AuthContext";
import axios from "@/lib/axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export type GutImage = {
  id: number,
  file_path: string,
  title: string,
  created_at: string,
  updated_at: string,
  maker_id: number,
  maker: Maker
}

const GutRegister: NextPage = () => {
  const router = useRouter();

  //gut登録用のデータstate
  const [inputNameJa, setInputNameJa] = useState<string>('');

  const [inputNameEn, setInputNameEn] = useState<string>('');

  const [gutMakerId, setGutMakerId] = useState<number | null>(null);

  const [needPostingImage, setNeedPostingImage] = useState<boolean>(true);

  const [gutImageId, setGutImageId] = useState<number>();

  const [makers, setMakers] = useState<Maker[]>();


  //検索関連のstate
  const [inputSearchWord, setInputSearchWord] = useState<string>('');

  const [inputSearchMaker, setInputSearchMaker] = useState<number | null>();

  const [searchedGutImages, setSearchedGutImages] = useState<GutImage[]>();

  //モーダルの開閉に関するstate
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [modalVisibilityClassName, setModalVisibilityClassName] = useState<string>('opacity-0 scale-0');



  console.log('makers', makers)
  console.log('inputNameJa', inputNameJa);
  console.log('inputNameEn', inputNameEn);
  console.log('gutMakerId', gutMakerId);
  console.log('needPostingImage', needPostingImage);
  console.log('gutImageId', gutImageId);
  console.log('inputSearchWord', inputSearchWord);
  console.log('inputSearchMaker', inputSearchMaker);
  console.log('searchedGutImages', searchedGutImages);

  const { admin, isAuthAdmin, } = useContext(AuthContext);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  useEffect(() => {
    if (admin.id) {
      const getGutList = async () => {
        await axios.get('api/makers').then(res => {
          setMakers(res.data);
        })
      }

      getGutList();
    } else {
      router.push('/admins/login')
    }
  }, [])

  const onChangeMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setGutMakerId(null);
      return
    };

    setGutMakerId(Number(e.target.value));
  }

  const onChangeInputSearchMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setInputSearchMaker(null);
      return
    };

    setInputSearchMaker(Number(e.target.value));
  }

  //モーダルの開閉
  const closeModal = () => {
    setModalVisibilityClassName('opacity-0 scale-0')
  }

  const openModal = () => {
    setModalVisibilityClassName('opacity-100 scale-100')
  }

  //gutImage検索
  const searchGutImages = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.get('api/gut_images/search', {
        params: {
          several_words: inputSearchWord,
          maker: inputSearchMaker
        }
      }).then((res) => {
        setSearchedGutImages(res.data);
      })

      console.log('検索完了しました')
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <AuthAdminCheck>
        {isAuthAdmin && (
          <>

            <div className="container mx-auto mb-8 w-screen pt-[24px]">

              <div className="text-center mb-6">
                <PrimaryHeading text="ストリング登録" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="w-[100%] max-w-[320px] md:w-[500px] mx-auto flex flex-col md:justify-center">
                <form action="" >
                  <div className="mb-6">
                    <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ストリング名(カナ)</label>
                    <input type="text" name="name_ja" onChange={(e) => setInputNameJa(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    {/* {errors.title.length !== 0 &&
                        errors.title.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ストリング名(アルファベット)</label>
                    <input type="text" name="name_ja" onChange={(e) => setInputNameEn(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    {/* {errors.title.length !== 0 &&
                        errors.title.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                  </div>

                  <div className=" mb-8">
                    <label htmlFor="maker" className="block">メーカー</label>

                    <select name="maker" id="maker" onChange={(e) => { onChangeMaker(e) }} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                      <option value="未選択" selected>未選択</option>
                      {makers?.map((maker) => (<option key={maker.id} value={maker.id}>{maker.name_ja}</option>))}
                    </select>

                    {/* {errors.grip_form.length !== 0 &&
                        errors.grip_form.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="need_posting_image">画像提供受付</label>
                    <input type="checkbox" name="need_posting_image" id="need_posting_image" defaultChecked={needPostingImage} onChange={(e) => setNeedPostingImage(prev => !prev)} />
                  </div>

                  {/* 画像選択 */}
                  <div className="mb-[64px]">
                    <input type="hidden" name="image_id" />

                    <div>
                      <p className="mb-2">選択中：{ }</p>
                      <div className="flex justify-between">
                        <div className="self-end">
                          <button type="button" onClick={openModal} className="text-white font-bold text-[14px] w-[80px] h-6 rounded  bg-sub-green">変更</button>
                        </div>

                        <div className="w-[100%] max-w-[200px] h-[120px] flex justify-center">
                          <img src="" alt="" className="w-[100%] max-w-[120px] border" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button type="submit" className="text-white font-bold text-[14px] w-[200px] h-8 rounded  bg-sub-green">登録</button>
                  </div>
                </form>
              </div>

              {/* 検索モーダル */}
              <div className={`bg-gray-300 w-screen min-h-screen absolute top-[64px] left-0 ${modalVisibilityClassName} duration-[400ms] pt-[24px] `}>
                <div className="flex flex-col items-center w-[100%] max-w-[320px] mx-auto">
                  <div onClick={closeModal} className="self-end">
                    <IoClose size={48} />
                  </div>

                  <form action="" onSubmit={searchGutImages} className="mb-[24px]">
                    <div className="mb-6">
                      <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">画像 検索ワード</label>
                      <input type="text" name="name_ja" onChange={(e) => setInputSearchWord(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                      {/* {errors.title.length !== 0 &&
                          errors.title.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        } */}
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="maker" className="block">メーカー</label>

                      <select name="maker" id="maker" onChange={(e) => { onChangeInputSearchMaker(e) }} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        <option value="未選択" selected>未選択</option>
                        {makers?.map((maker) => (<option key={maker.id} value={maker.id}>{maker.name_ja}</option>))}
                      </select>

                      {/* {errors.grip_form.length !== 0 &&
                          errors.grip_form.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                        } */}
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="text-white font-bold text-[14px] w-[160px] h-8 rounded  bg-sub-green">検索する</button>
                    </div>
                  </form>

                  {/* 検索結果表示欄 */}
                  <div className="w-[100%] max-w-[320px]">
                    <p className="text-[14px] mb-[16px]">検索結果</p>
                    <div className="flex justify-between flex-wrap w-[100%] max-w-[320px]">
                      {searchedGutImages?.map(gutImage => (
                        <>
                          {/* ガット画像情報カード */}
                          <div className="bg-white p-2 rounded-lg w-[100%] max-w-[136px] hover:opacity-80 mb-6">
                            <div className="w-[120px] mb-2">
                              {gutImage.file_path && <img src={`${baseImagePath}${gutImage.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />}
                              {/* {gutImage.file_path
                              ? <img src={`${baseImagePath}${gutImage.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                              : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[120px]" />
                            } */}
                            </div>

                            <p className="text-[14px] mb-1">{gutImage.maker.name_ja}</p>

                            <p className="text-[14px]">{gutImage.title}</p>
                          </div>
                        </>
                      ))}
                    </div>

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

export default GutRegister;
