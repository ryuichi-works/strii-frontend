import type { Gut } from "../reviews";
import type { Maker } from "../users/[id]/profile";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/lib/axios";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

import AuthCheck from "@/components/AuthCheck";
import TextUnderBar from "@/components/TextUnderBar";
import PrimaryHeading from "@/components/PrimaryHeading";
import { Adamina } from "next/font/google";
import { IoClose } from "react-icons/io5";
import Pagination, {type Paginator } from "@/components/Pagination";

const GutList = () => {
  const router = useRouter();

  const { isAuth, user, setUser, setIsAuth, admin, isAuthAdmin } = useContext(AuthContext);

  const [gutsPaginator, setGutsPaginator] = useState<Paginator<Gut>>();

  const [guts, setGuts] = useState<Gut[]>();
  console.log('guts', guts)

  const [makers, setMakers] = useState<Maker[]>();

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  //検索関連のstate
  const [inputSearchWord, setInputSearchWord] = useState<string>('');

  const [inputSearchMaker, setInputSearchMaker] = useState<number | null>();

  //モーダルの開閉に関するstate
  const [modalVisibilityClassName, setModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  //ページネーションを考慮したgut一覧データの取得関数
  const getGutsList = async (url: string = 'api/guts') => {
    await axios.get(url).then(res => {
      console.log('res', res.data)
      setGutsPaginator(res.data)
      setGuts(res.data.data);
    })
  }

  useEffect(() => {
    if (user.id || admin.id) {
      const getMakerList = async () => {
        await axios.get('api/makers').then(res => {
          setMakers(res.data);
        })
      }

      getMakerList();

      getGutsList();
    } else {
      router.push('/users/login');
    }
  }, [])

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

  //gut検索
  const searchGuts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios.get('api/guts/search', {
      params: {
        several_words: inputSearchWord,
        maker: inputSearchMaker
      }
    }).then((res) => {
      closeModal();

      setGutsPaginator(res.data)

      setGuts(res.data.data);

      console.log('検索完了しました');
    }).catch(e => {
      console.log(e);
    })

  }

  return (
    <>
      <AuthCheck>
        {(isAuth || isAuthAdmin) && (
          <div className="container mx-auto md:mt-[32px]">
            <div className="text-center mb-6 md:mb-[32px]">
              <PrimaryHeading text="Strings" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
            </div>

            <div className="flex justify-center mb-[48px] md:justify-end w-[100%] max-w-[768px] mx-auto">
              <button
                onClick={openModal}
                className="text-white text-[14px] w-[264px] h-8 rounded  bg-sub-green md:w-[80px] md:h-[32px] md:hidden"
              >検索</button>

              <div className={'hidden md:block bg-gray-300 w-[100%] max-w-[768px] h-[100px] rounded-lg'}>
                <div className="flex flex-col items-center justify-center w-[100%] mx-auto max-w-[768px] h-[100%]">
                  <form action="" onSubmit={searchGuts} className=" flex">
                    <div className="mb-6 md:mb-0 md:mr-[16px]">
                      <label htmlFor="name_ja" className="block text-[16px] mb-2 pl-1 h-[18px]">ストリング検索ワード</label>
                      <input type="text" name="name_ja" onChange={(e) => setInputSearchWord(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[300px] h-10 p-2 focus:outline-sub-green" />
                    </div>

                    <div className="mb-8 md:mb-0 md:mr-[24px]">
                      <label htmlFor="maker" className="block text-[16px] mb-2 pl-1  h-[18px]">メーカー</label>

                      <select name="maker" id="maker" onChange={(e) => { onChangeInputSearchMaker(e) }} className="border border-gray-300 rounded w-80 md:w-[250px] h-10 p-2 focus:outline-sub-green">
                        <option value="未選択" selected>未選択</option>
                        {makers?.map((maker) => (<option key={maker.id} value={maker.id}>{maker.name_ja}</option>))}
                      </select>
                    </div>

                    <div className="flex justify-end md:justify-start">
                      <button type="submit" className="text-white font-bold text-[14px] w-[160px] h-8 rounded  bg-sub-green md:text-[16px] md:self-end md:h-[40px] md:w-[100px]">検索する</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ガットセクション */}
            <div className="">
              <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:flex-wrap md:justify-between ">
                {/* ガット */}
                {guts && guts.map(gut => (
                  <Link href={`/guts/${gut.id}`} key={gut.id} className="block hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                    <div className="flex  mb-6 hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
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
                  </Link>
                ))}
              </div>
            </div>

            {/* 検索モーダル */}
            <div className={`bg-gray-300 w-screen min-h-[100%] absolute top-[64px] left-0 ${modalVisibilityClassName} duration-[400ms] pt-[24px] overflow-y-auto md:hidden`}>
              <div className="flex flex-col items-center w-[100%] max-w-[320px] mx-auto md:max-w-[768px]">
                <div onClick={closeModal} className="self-end hover:cursor-pointer md:mr-[39px]">
                  <IoClose size={48} />
                </div>

                <form action="" onSubmit={searchGuts} className="mb-[24px] md:flex md:mb-[40px]">
                  <div className="mb-6 md:mb-0 md:mr-[16px]">
                    <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ストリング検索ワード</label>
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
              </div>
            </div>

            {/* ページネーション */}
            <Pagination
              paginator={gutsPaginator}
              paginate={getGutsList}
              className="mt-[32px] md:mt-[48px]"
            />
          </div>
        )}
      </AuthCheck>
    </>
  );
}

export default GutList;
