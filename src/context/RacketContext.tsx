import { Paginator } from "@/components/Pagination";
import { Gut } from "@/pages/reviews";
import { Racket } from "@/pages/users/[id]/profile";
import React, { ReactNode, createContext, useState } from "react";

type ContextVals = {
  racketsPaginator: Paginator<Racket> | undefined,
  setRacketsPaginator: React.Dispatch<React.SetStateAction<Paginator<Racket> | undefined>>,
  rackets: Racket[] | undefined,
  setRackets: React.Dispatch<React.SetStateAction<Racket[] | undefined>>,
  inputSearchWord: string,
  setInputSearchWord: React.Dispatch<React.SetStateAction<string>>,
  inputSearchMaker: number | undefined,
  setInputSearchMaker: React.Dispatch<React.SetStateAction<number | undefined>>,
}

const initialContextVals = {
  racketsPaginator: undefined,
  setRacketsPaginator:  () => { },
  rackets: undefined,
  setRackets: () => { },
  inputSearchWord: '',
  setInputSearchWord:  () => { },
  inputSearchMaker: undefined,
  setInputSearchMaker: () => { },
}

const RacketContext = createContext<ContextVals>(initialContextVals);

type Props = {
  children: ReactNode
}

const RacketContextProvider: React.FC<Props> = ({ children }) => {
  const [racketsPaginator, setRacketsPaginator] = useState<Paginator<Racket>>();
  const [rackets, setRackets] = useState<Racket[]>();

  //検索関連のstate
  const [inputSearchWord, setInputSearchWord] = useState<string>('');

  const [inputSearchMaker, setInputSearchMaker] = useState<number>();

  const contextVals = {
    racketsPaginator,
    setRacketsPaginator,
    rackets,
    setRackets,
    inputSearchWord,
    setInputSearchWord,
    inputSearchMaker,
    setInputSearchMaker,
  }

  return (
    <>
      <RacketContext.Provider value={contextVals} >
        {children}
      </RacketContext.Provider>
    </>
  );
}

export {
  RacketContextProvider,
  RacketContext
}
