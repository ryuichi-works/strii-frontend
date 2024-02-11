import type { Maker, Racket } from "../users/[id]/profile";

import axios from "@/lib/axios";
import { firstLetterToUpperCase } from "@/modules/firstLetterToUpperCase";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { RacketContext } from "@/context/RacketContext";
import { usePathHistory } from "@/context/HistoryContext";
import { useRouter } from "next/router";

import Link from "next/link";
import AuthCheck from "@/components/AuthCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import TextUnderBar from "@/components/TextUnderBar";
import { IoClose } from "react-icons/io5";
import Pagination, { type Paginator } from "@/components/Pagination";
import RacketSearchModal from "@/components/RacketSearchModal";


const RacketList = () => {
  const router = useRouter();

  const [, lastBeforePath] = usePathHistory();

  const { isAuth, user, isAuthAdmin } = useContext(AuthContext);

  const {
    racketsPaginator,
    setRacketsPaginator,
    rackets,
    setRackets,
    inputSearchWord,
    setInputSearchWord,
    inputSearchMaker,
    setInputSearchMaker,
  } = useContext(RacketContext);

  const [makers, setMakers] = useState<Maker[]>();

  //モーダルの開閉に関するstate
  const [racketSearchModalVisibility, setRacketSearchModalVisibility] = useState<boolean>(false);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/';

  //ページネーションを考慮したracket一覧データの取得関数
  const getRacketsList = async (url: string = 'api/rackets') => {
    await axios.get(url).then(res => {
      console.log('res', res.data)
      setRacketsPaginator(res.data)
      setRackets(res.data.data);
    })
  }

  useEffect(() => {
    const getMakerList = async () => {
      await axios.get('api/makers').then(res => {
        setMakers(res.data);
      })
    }

    getMakerList();

    let isVisitingByHistoryBack = router.asPath === lastBeforePath;

    if (!rackets || !isVisitingByHistoryBack) {
      getRacketsList();
      setInputSearchWord('');
      setInputSearchMaker(undefined);
    }
  }, [])

  const onChangeInputSearchMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setInputSearchMaker(undefined);
      return
    };

    setInputSearchMaker(Number(e.target.value));
  }

  //モーダルの開閉
  const openModal = () => {
    setRacketSearchModalVisibility(true);
  }

  //pcレイアウト用racket検索
  const searchRackets = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios.get('api/rackets/search', {
      params: {
        several_words: inputSearchWord,
        maker: inputSearchMaker
      }
    }).then((res) => {
      setRacketsPaginator(res.data)

      setRackets(res.data.data);

      console.log('検索完了しました');
    }).catch(e => {
      console.log(e);
    })

  }

  return (
    <>
      <AuthCheck>
        {(isAuth || isAuthAdmin) && (
          <>
            <div className="container mx-auto mt-[24px] md:mt-[32px]">
              <div className="text-center mb-6 md:mb-[32px]">
                <PrimaryHeading text="Rackets" className="text-[18px] italic h-[20px] md:text-[20px] md:h-[22px]" />
              </div>

              {/* 検索 */}
              <div className="flex justify-center mb-6 md:justify-end md:w-[100%] md:max-w-[768px] md:mx-auto">
                <button
                  onClick={openModal}
                  className="text-white text-[14px] w-[264px] h-8 rounded  bg-sub-green md:w-[80px] md:h-[32px] md:hidden"
                >検索</button>

                {/* 検索欄pcサイズ */}
                <div className={'hidden md:block bg-gray-300 w-[100%] max-w-[768px] h-[100px] rounded-lg'}>
                  <div className="flex flex-col items-center justify-center w-[100%] mx-auto max-w-[768px] h-[100%]">
                    <form
                      onSubmit={searchRackets}
                      className=" flex"
                    >
                      <div className="mb-6 md:mb-0 md:mr-[16px]">
                        <label
                          htmlFor="name_ja"
                          className="block text-[16px] mb-2 pl-1 h-[18px]"
                        >ラケット検索ワード</label>

                        <input
                          type="text"
                          name="name_ja"
                          defaultValue={inputSearchWord}
                          onChange={(e) => setInputSearchWord(e.target.value)}
                          className="border border-gray-300 rounded w-80 md:w-[300px] h-10 p-2 focus:outline-sub-green"
                        />
                      </div>

                      <div className="mb-8 md:mb-0 md:mr-[24px]">
                        <label
                          htmlFor="maker"
                          className="block text-[16px] mb-2 pl-1  h-[18px]"
                        >メーカー</label>

                        <select
                          name="maker"
                          id="maker"
                          value={inputSearchMaker ? inputSearchMaker : '未選択'}
                          onChange={(e) => { onChangeInputSearchMaker(e) }}
                          className="border border-gray-300 rounded w-80 md:w-[250px] h-10 p-2 focus:outline-sub-green"
                        >
                          <option value="未選択">未選択</option>
                          {makers?.map((maker) => (<option key={maker.id} value={maker.id}>{maker.name_ja}</option>))}
                        </select>
                      </div>

                      <div className="flex justify-end md:justify-start">
                        <button
                          type="submit"
                          className="text-white font-bold text-[14px] w-[160px] h-8 rounded  bg-sub-green md:text-[16px] md:self-end md:h-[40px] md:w-[100px]"
                        >検索する</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* ラケットセクション */}
              <div>
                <div className="w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex md:flex-wrap md:justify-between">
                  {rackets?.map(racket => (
                    <Link href={`/rackets/${racket.id}`} key={racket.id} className="block hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                      <div className="flex  mb-6 hover:opacity-80 hover:cursor-pointer md:w-[100%] md:max-w-[360px]">
                        <div className="w-[120px] mr-6">
                          {racket.racket_image.file_path
                            ? <img src={`${baseImagePath}${racket.racket_image.file_path}`} alt="ストリング画像" className="w-[120px] h-[160px]" />
                            : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} alt="ストリング画像" className="w-[120px] h-[160px]" />
                          }
                        </div>

                        <div className="w-[100%] max-w-[176px] pt-4 md:max-w-[216px]">
                          <p className="text-[14px] mb-2 pl-2 md:text-[16px]">{firstLetterToUpperCase(racket.maker.name_en)}</p>
                          <p className="text-[16px] text-center mb-2 md:text-[18px]">{racket.name_ja}</p>
                          <TextUnderBar className="w-[100%] max-w-[176px] md:max-w-[216px]" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 検索モーダル */}
              <RacketSearchModal
                modalVisibility={racketSearchModalVisibility}
                setModalVisibility={setRacketSearchModalVisibility}
                makers={makers}
                showingResult={false}
                searchedRackets={rackets}
                setSearchedRackets={setRackets}
                zIndexClassName="z-50"
                setRacketsPaginator={setRacketsPaginator}
                inputSearchWord={inputSearchWord}
                setInputSearchWord={setInputSearchWord}
                inputSearchMaker={inputSearchMaker}
                setInputSearchMaker={setInputSearchMaker}
              />

              {/* ページネーション */}
              <Pagination
                paginator={racketsPaginator}
                paginate={getRacketsList}
                className="mt-[32px] md:mt-[48px]"
              />
            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default RacketList;
