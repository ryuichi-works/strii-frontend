import { Paginator } from "@/components/Pagination";
import { Gut } from "@/pages/reviews";
import React, { ReactNode, createContext, useState } from "react";

type ContextVals = {
  gutsPaginator: Paginator<Gut> | undefined,
  setGutsPaginator: React.Dispatch<React.SetStateAction<Paginator<Gut> | undefined>>,
  guts: Gut[] | undefined,
  setGuts: React.Dispatch<React.SetStateAction<Gut[] | undefined>>,
  inputSearchWord: string,
  setInputSearchWord: React.Dispatch<React.SetStateAction<string>>,
  inputSearchMaker: number | undefined,
  setInputSearchMaker: React.Dispatch<React.SetStateAction<number | undefined>>,
}

const initialContextVals = {
  gutsPaginator: undefined,
  setGutsPaginator:  () => { },
  guts: undefined,
  setGuts: () => { },
  inputSearchWord: '',
  setInputSearchWord:  () => { },
  inputSearchMaker: undefined,
  setInputSearchMaker: () => { },
}

const GutContext = createContext<ContextVals>(initialContextVals);

type Props = {
  children: ReactNode
}

const GutContextProvider: React.FC<Props> = ({ children }) => {
  const [gutsPaginator, setGutsPaginator] = useState<Paginator<Gut>>();
  const [guts, setGuts] = useState<Gut[]>();

  //検索関連のstate
  const [inputSearchWord, setInputSearchWord] = useState<string>('');

  const [inputSearchMaker, setInputSearchMaker] = useState<number>();

  const contextVals = {
    gutsPaginator,
    setGutsPaginator,
    guts,
    setGuts,
    inputSearchWord,
    setInputSearchWord,
    inputSearchMaker,
    setInputSearchMaker,
  }

  return (
    <>
      <GutContext.Provider value={contextVals} >
        {children}
      </GutContext.Provider>
    </>
  );
}

export {
  GutContextProvider,
  GutContext
}
