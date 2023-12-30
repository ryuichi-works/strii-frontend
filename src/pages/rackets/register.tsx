import type { Maker, RacketImage } from "../users/[id]/profile";
import AuthAdminCheck from "@/components/AuthAdminCheck";
import Pagination, { Paginator } from "@/components/Pagination";
import PrimaryHeading from "@/components/PrimaryHeading";
import { AuthContext } from "@/context/AuthContext";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";


const RacketRegister: NextPage = () => {
  const router = useRouter();

  //racket登録用のデータstate
  const [inputNameJa, setInputNameJa] = useState<string>('');

  const [inputNameEn, setInputNameEn] = useState<string>('');

  const [racketMakerId, setRacketMakerId] = useState<number | null>(null);

  const [needPostingImage, setNeedPostingImage] = useState<boolean>(true);

  const [racketImageId, setRacketImageId] = useState<number>();

  const [makers, setMakers] = useState<Maker[]>();

  const [selectedRacketImage, setSelectedRacketImage] = useState<RacketImage>();

  const [racketImagesPaginator, setRacketImagesPaginator] = useState<Paginator<RacketImage>>();

  
  console.log('inputNameJa', inputNameJa)
  console.log('inputNameEn', inputNameEn)
  console.log('racketMakerId', racketMakerId)
  console.log('needPostingImage', needPostingImage)
  console.log('racketImageId', racketImageId)

  //検索関連のstate
  const [inputSearchWord, setInputSearchWord] = useState<string>('');

  const [inputSearchMaker, setInputSearchMaker] = useState<number | null>();

  const [searchedRacketImages, setSearchedRacketImages] = useState<RacketImage[]>();

  //モーダルの開閉に関するstate
  const [modalVisibilityClassName, setModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  const { admin, isAuthAdmin, } = useContext(AuthContext);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  useEffect(() => {
    const getMakerList = async () => {
      await axios.get('api/makers').then(res => {
        setMakers(res.data);
      })
    }

    getMakerList();
  }, [])

  const onChangeMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setRacketMakerId(null);
      return
    };

    setRacketMakerId(Number(e.target.value));
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


  const selectImage = (racketImage: RacketImage) => {
    setSelectedRacketImage(racketImage);
    setRacketImageId(racketImage.id);
    closeModal();
  }

  //gut登録処理関連
  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const registerRacket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerData = {
      name_ja: inputNameJa,
      name_en: inputNameEn,
      maker_id: racketMakerId,
      image_id: racketImageId,
      need_posting_image: needPostingImage,
    }

    await csrf();

    await axios.post('api/rackets', registerData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(res => {
      console.log('ラケットを新規登録しました。');

      router.push('/rackets');
    }).catch((e) => {
      const newErrors = { ...initialErrorVals, ...e.response.data.errors };

      setErrors(newErrors);

      console.log('ラケットの登録に失敗しました');
    })
  }

  return (
    <>
      <AuthAdminCheck>
        {isAuthAdmin && (
          <>

            <div className="container mx-auto mb-8 w-screen pt-[24px] overflow-y-auto">

              <div className="text-center mb-6">
                <PrimaryHeading text="ラケット登録" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              <div className="w-[100%] max-w-[320px] md:max-w-[380px] mx-auto flex flex-col md:justify-center">
                <form action="" onSubmit={(e) => registerRacket(e)}>
                  <div className="mb-6">
                    <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ラケット名(カナ)</label>
                    <input type="text" name="name_ja" onChange={(e) => setInputNameJa(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    {errors.name_ja.length !== 0 &&
                      errors.name_ja.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                    }
                  </div>

                  <div className="mb-6">
                    <label htmlFor="name_en" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ラケット名(アルファベット)</label>
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
                      <p className="mb-2 text-[14px] md:text-[16px]">選択中：{selectedRacketImage ? selectedRacketImage.title : 'デフォルト'}</p>
                      <div className="flex justify-between md:w-[100%] md:max-w-[380px]">
                        <div className="self-end">
                          <button type="button" onClick={openModal} className="text-white font-bold text-[14px] w-[80px] h-6 rounded  bg-sub-green">選ぶ</button>
                        </div>

                        <div className="w-[100%] max-w-[200px] h-[160px] flex justify-center md:h-[200px] md:justify-end">
                          {selectedRacketImage
                            ? <img src={`${baseImagePath}${selectedRacketImage?.file_path}`} alt="" className="w-[100%] max-w-[120px] h-[160px] border md:max-w-[150px] md:h-[200px]" />
                            : <img src={`${baseImagePath}images/rackets/default_racket_image.png`} alt="" className="w-[100%] max-w-[120px] h-[160px] border md:max-w-[150px] md:h-[200px]" />
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
                          {/* ラケット画像情報カード */}
                          <div key={racketImage.id} onClick={() => selectImage(racketImage)} className="bg-white p-2 rounded-lg w-[100%] max-w-[136px] hover:opacity-80 mb-6 hover:cursor-pointer md:[&:not(:last-child)]:mr-[24px]">
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

export default RacketRegister;

