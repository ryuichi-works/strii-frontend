import type { Maker } from "../users/[id]/profile";

import AuthAdminCheck from "@/components/AuthAdminCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import { AuthContext } from "@/context/AuthContext";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
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

const GutEdit: NextPage = () => {
  const router = useRouter();

  //gut登録用のデータstate
  const [inputNameJa, setInputNameJa] = useState<string>('');

  const [inputNameEn, setInputNameEn] = useState<string>('');

  const [gutMakerId, setGutMakerId] = useState<number | null>(null);

  const [needPostingImage, setNeedPostingImage] = useState<boolean>(true);

  const [gutImageId, setGutImageId] = useState<number>();

  const [makers, setMakers] = useState<Maker[]>();

  const [selectedGutImage, setSelectedGutImage] = useState<GutImage>();

``
  //検索関連のstate
  const [inputSearchWord, setInputSearchWord] = useState<string>('');

  const [inputSearchMaker, setInputSearchMaker] = useState<number | null>();

  const [searchedGutImages, setSearchedGutImages] = useState<GutImage[]>();

  //モーダルの開閉に関するstate
  const [modalVisibilityClassName, setModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  const { admin, isAuthAdmin, } = useContext(AuthContext);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  useEffect(() => {
    const getGutList = async () => {
      await axios.get('api/makers').then(res => {
        setMakers(res.data);
      })
    }

    getGutList();
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

  //エラーメッセージ関連
  type Errors = {
    name_ja: string[],
    name_en: string[],
    maker_id: string[],
    image_id: string[],
  }

  const initialErrorVals = { name_ja: [], name_en: [], maker_id: [], image_id: [] };

  const [errors, setErrors] = useState<Errors>(initialErrorVals);

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


  const selectImage = (gutImage: GutImage) => {
    setSelectedGutImage(gutImage);
    setGutImageId(gutImage.id);
    closeModal();
  }

  //gut登録処理関連
  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const registerGut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerData = {
      name_ja: inputNameJa,
      name_en: inputNameEn,
      maker_id: gutMakerId,
      image_id: gutImageId,
      need_posting_image: needPostingImage,
    }

    await csrf();

    await axios.post('api/guts', registerData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(res => {
      console.log('ストリングを新規登録しました。');

      router.push('/guts');
    }).catch((e) => {
      const newErrors = { ...initialErrorVals, ...e.response.data.errors };

      setErrors(newErrors);

      console.log('ストリングの登録に失敗しました');
    })
  }

  return (
    <>
      <AuthAdminCheck>
        {isAuthAdmin && (
          <>

            <div className="container mx-auto mb-8 w-screen pt-[24px] overflow-y-auto">

              <div className="text-center mb-6">
                <PrimaryHeading text="ストリング登録" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="w-[100%] max-w-[320px] md:max-w-[380px] mx-auto flex flex-col md:justify-center">
                <form action="" onSubmit={(e) => registerGut(e)}>
                  <div className="mb-6">
                    <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ストリング名(カナ)</label>
                    <input type="text" name="name_ja" onChange={(e) => setInputNameJa(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    {errors.name_ja.length !== 0 &&
                      errors.name_ja.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  <div className="mb-6">
                    <label htmlFor="name_en" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ストリング名(アルファベット)</label>
                    <input type="text" name="name_en" onChange={(e) => setInputNameEn(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    {errors.name_en.length !== 0 &&
                      errors.name_en.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  <div className=" mb-8">
                    <label htmlFor="maker" className="block text-[14px] md:text-[16px]">メーカー</label>

                    <select name="maker" id="maker" onChange={(e) => { onChangeMaker(e) }} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                      <option value="未選択" selected>未選択</option>
                      {makers?.map((maker) => (<option key={maker.id} value={maker.id}>{maker.name_ja}</option>))}
                    </select>

                    {errors.maker_id.length !== 0 &&
                      errors.maker_id.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  <div className="mb-6">
                    <label htmlFor="need_posting_image" className="text-[14px] mr-1 md:text-[16px]">画像提供受付</label>
                    <input type="checkbox" name="need_posting_image" id="need_posting_image" defaultChecked={needPostingImage} onChange={(e) => setNeedPostingImage(prev => !prev)} className="align-middle"/>
                  </div>

                  {/* 画像選択 */}
                  <div className="mb-[64px] md:w-[100%] md:max-w-[380px]">
                    <input type="hidden" name="image_id" />

                    <div className="md:w-[100%] md:max-w-[380px]">
                      <p className="mb-2 text-[14px] md:text-[16px]">選択中：{selectedGutImage ? selectedGutImage.title : 'デフォルト'}</p>
                      <div className="flex justify-between md:w-[100%] md:max-w-[380px]">
                        <div className="self-end">
                          <button type="button" onClick={openModal} className="text-white font-bold text-[14px] w-[80px] h-6 rounded  bg-sub-green">変更</button>
                        </div>

                        <div className="w-[100%] max-w-[200px] h-[120px] flex justify-center md:h-[160px] md:max-w-[] md:justify-end">
                          {selectedGutImage
                            ? <img src={`${baseImagePath}${selectedGutImage?.file_path}`} alt="" className="w-[100%] max-w-[120px] border md:max-w-[160px]" />
                            : <img src={`${baseImagePath}images/guts/default_gut.jpg`} alt="" className="w-[100%] max-w-[120px] border md:max-w-[160px]" />
                          }
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
              <div className={`bg-gray-300 w-screen min-h-screen absolute top-[64px] left-0 ${modalVisibilityClassName} duration-[400ms] pt-[24px] overflow-y-auto`}>
                <div className="flex flex-col items-center w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">
                  <div onClick={closeModal} className="self-end hover:cursor-pointer md:mr-[39px]">
                    <IoClose size={48} />
                  </div>

                  <form action="" onSubmit={searchGutImages} className="mb-[24px] md:flex md:mb-[40px]">
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
                      {searchedGutImages?.map(gutImage => (
                        <>
                          {/* ガット画像情報カード */}
                          <div onClick={() => selectImage(gutImage)} className="bg-white p-2 rounded-lg w-[100%] max-w-[136px] hover:opacity-80 mb-6 hover:cursor-pointer md:[&:not(:last-child)]:mr-[24px]">
                            <div className="w-[120px] mb-2">
                              {gutImage.file_path && <img src={`${baseImagePath}${gutImage.file_path}`} alt="ストリング画像" className="w-[120px] h-[120px]" />}
                            </div>

                            <p className="text-[14px] mb-1 md:text-[16px]">{gutImage.maker.name_ja}</p>

                            <p className="text-[14px] md:text-[16px]">{gutImage.title}</p>
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

export default GutEdit;

