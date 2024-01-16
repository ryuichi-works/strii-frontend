// コンポーネントの使い方
// 使用先ファイルにコンポーネント本体と検索結果を扱うstate(searchedGuts)、モーダルの開閉状態を扱うstate(modalVisibility)を用意する
// makerの情報をapiで所得、stateを介してmakerプロップスに渡す
// 検索結果をモーダル内に表示する場合は、showingResultをtrueとする
// 各種clickイベントの時に呼び出し元起因の処理が必要ならば、closeModalHandler、selectGutHandlerにメソッドのプロップスとして渡す
// モーダルを利用した時の固有の背景スクロールバーの不具合はコンポーネント呼び出し元でmodalVisibilityの状態を使って改善すると良い。

import { IoClose } from "react-icons/io5";
import TextUnderBar from "./TextUnderBar";
import Pagination, { Paginator } from "./Pagination";
import axios from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Gut } from "@/pages/reviews";
import { Maker } from "@/pages/users/[id]/profile";
import { baseImagePath } from "@/consts/global";

type GutSearchModalProps = {
  modalVisibility: boolean,
  setModalVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  showingResult: boolean,
  setSearchedGuts: React.Dispatch<React.SetStateAction<Gut[] | undefined>>

  // モーダルを閉じる時に呼び出し元で追加処理したい処理をメソッドとして渡す
  closeModalHandler?: any,
  
  // ガットカードをクリック（select）した時に追加したい処理をメソッドとして渡す
  selectGutHandler?: any,
  makers?: Maker[],
  searchedGuts?: Gut[],
  zIndexClassName?: string,
}

const GutSearchModal: React.FC<GutSearchModalProps> = ({
  modalVisibility,
  setModalVisibility,
  makers,
  closeModalHandler,
  selectGutHandler,
  showingResult = false,
  searchedGuts,
  setSearchedGuts,
  zIndexClassName,
}) => {
  const [gutsPaginator, setGutsPaginator] = useState<Paginator<Gut>>();

  // 検索input関連state
  const [inputSearchWord, setInputSearchWord] = useState<string>('');
  const [inputSearchMaker, setInputSearchMaker] = useState<number | null>();

  const [modalVisibilityClassName, setModalVisibilityClassName] = useState<string>('opacity-0 scale-0');

  // modalVisibility trueになった時にモーダルを開くため、開く動作はuseEffectで管理
  useEffect(() => {
    if (modalVisibility) {
      setModalVisibilityClassName('opacity-100 scale-100');
    } else {
      setModalVisibilityClassName('opacity-0 scale-0');
    }
  }, [modalVisibility])

  const onChangeInputSearchMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '未選択') {
      setInputSearchMaker(null);
      return
    };

    setInputSearchMaker(Number(e.target.value));
  }

  //ページネーションを考慮した検索後gut一覧データの取得関数
  const getSearchedGutsList = async (url: string = `api/guts/search?several_words=${inputSearchWord}&maker=${inputSearchMaker ? inputSearchMaker : ''}`) => {
    await axios.get(url).then((res) => {
      setGutsPaginator(res.data);

      setSearchedGuts(res.data.data);
    })
  }

  //gut検索
  const searchGuts = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      getSearchedGutsList();

      if(!showingResult) {
        closeModal();
      }

      console.log('検索完了しました')
    } catch (e) {
      console.log(e);
    }
  }

  const closeModal = () => {
    setModalVisibility(false);
    setModalVisibilityClassName('opacity-0 scale-0')
    closeModalHandler();
  }

  const selectGut = (gut: Gut) => {
    selectGutHandler(gut);

    closeModal();
  }

  return (
    <>
      {/* gut検索モーダル */}
      <div className={`bg-gray-300 w-screen h-screen fixed top-0 left-0 ${modalVisibilityClassName} duration-[400ms] pt-[24px] overflow-y-scroll ${zIndexClassName}`}>
        <div className="flex flex-col items-center w-[100%] max-w-[320px] mx-auto md:max-w-[768px] overflow-y-auto">
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

          {showingResult && (
            <>
              {/* 検索結果表示欄 */}
              <div className="w-[100%] max-w-[320px] md:max-w-[768px]">
                <p className="text-[14px] mb-[16px] md:text-[16px] md:max-w-[640px] md:mx-auto">検索結果</p>
                <div className="flex justify-between flex-wrap w-[100%] max-w-[320px] md:max-w-[768px] md:mx-auto">
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

                <Pagination
                  paginator={gutsPaginator}
                  paginate={getSearchedGutsList}
                  className="mt-[32px] mb-[32px] md:mt-[48px] md:mb-[48px]"
                />
              </div>

            </>
          )}

        </div>
      </div>
    </>
  );
}

export default GutSearchModal;
