import { Paginator } from "@/components/Pagination";
import useTennisProfileForm from "@/hooks/useTennisProfileForm";
import { Gut, Review } from "@/pages/reviews";
import { Age, FavaritShot, Frequency, Gender, GripForm, Height, Physique, PlayStyle, WeakShot } from "@/pages/users/[id]/edit/tennis_profile";
import { Racket } from "@/pages/users/[id]/profile";
import React, { ReactNode, createContext, useState } from "react";

type ContextVals = {
  reviewsPaginator: Paginator<Review> | undefined,
  setReviewsPaginator: React.Dispatch<React.SetStateAction<Paginator<Review> | undefined>>,

  reviews: Review[] | undefined,
  setReviews: React.Dispatch<React.SetStateAction<Review[] | undefined>>,

  searchedGuts: Gut[] | undefined,
  setSearchedGuts: React.Dispatch<React.SetStateAction<Gut[] | undefined>>,

  searchedRackets: Racket[] | undefined,
  setSearchedRackets: React.Dispatch<React.SetStateAction<Racket[] | undefined>>,

  // 検索で使うstateの型
  matchRate: number,
  setMatchRate: React.Dispatch<React.SetStateAction<number>>,

  pysicalDurability: number,
  setPysicalDurability: React.Dispatch<React.SetStateAction<number>>,

  performanceDurability: number,
  setPerformanceDurability: React.Dispatch<React.SetStateAction<number>>,

  stringingWay?: string,
  setStringingWay: React.Dispatch<React.SetStateAction<string | undefined>>,

  mainGut: Gut | undefined,
  setMainGut: React.Dispatch<React.SetStateAction<Gut | undefined>>,

  crossGut: Gut | undefined,
  setCrossGut: React.Dispatch<React.SetStateAction<Gut | undefined>>,

  racket: Racket | undefined,
  setRacket: React.Dispatch<React.SetStateAction<Racket | undefined>>,

  experiencePeriod: number | undefined,
  setExperiencePeriod: React.Dispatch<React.SetStateAction<number | undefined>>,

  frequency: Frequency | undefined,
  setFrequency: React.Dispatch<React.SetStateAction<Frequency | undefined>>,

  playStyle: PlayStyle | undefined,
  setPlayStyle: React.Dispatch<React.SetStateAction<PlayStyle | undefined>>,

  gripForm: GripForm | undefined,
  setGripForm: React.Dispatch<React.SetStateAction<GripForm | undefined>>,

  favaritShot: FavaritShot | undefined,
  setFavaritShot: React.Dispatch<React.SetStateAction<FavaritShot | undefined>>,

  weakShot: WeakShot | undefined,
  setWeakShot: React.Dispatch<React.SetStateAction<WeakShot | undefined>>,

  age: Age | undefined,
  setAge: React.Dispatch<React.SetStateAction<Age | undefined>>,

  gender: Gender | undefined,
  setGender: React.Dispatch<React.SetStateAction<Gender | undefined>>,

  height: Height | undefined,
  setHeight: React.Dispatch<React.SetStateAction<Height | undefined>>,

  physique: Physique | undefined,
  setPhysique: React.Dispatch<React.SetStateAction<Physique | undefined>>,

  inputGutSearchWord: string,
  setInputGutSearchWord: React.Dispatch<React.SetStateAction<string>>,

  inputGutSearchMaker?: number,
  setInputGutSearchMaker: React.Dispatch<React.SetStateAction<number | undefined>>,

  inputRacketSearchWord: string,
  setInputRacketSearchWord: React.Dispatch<React.SetStateAction<string>>,

  inputRacketSearchMaker?: number,
  setInputRacketSearchMaker: React.Dispatch<React.SetStateAction<number | undefined>>,
}

const initialContextVals = {
  reviewsPaginator: undefined,
  setReviewsPaginator: () => { },

  reviews: undefined,
  setReviews: () => { },

  searchedGuts: undefined,
  setSearchedGuts: () => { },

  searchedRackets: undefined,
  setSearchedRackets: () => { },

  // 検索で使うstateの初期値
  matchRate: 1,
  setMatchRate: () => { },

  pysicalDurability: 1,
  setPysicalDurability: () => { },

  performanceDurability: 1,
  setPerformanceDurability: () => { },

  stringingWay: '未設定',
  setStringingWay: () => { },

  mainGut: undefined,
  setMainGut: () => { },

  crossGut: undefined,
  setCrossGut: () => { },

  racket: undefined,
  setRacket: () => { },

  experiencePeriod: undefined,
  setExperiencePeriod: () => { },

  frequency: undefined,
  setFrequency: () => { },

  playStyle: undefined,
  setPlayStyle: () => { },

  gripForm: undefined,
  setGripForm: () => { },

  favaritShot: undefined,
  setFavaritShot: () => { },

  weakShot: undefined,
  setWeakShot: () => { },

  age: undefined,
  setAge: () => { },

  gender: undefined,
  setGender: () => { },

  height: undefined,
  setHeight: () => { },

  physique: undefined,
  setPhysique: () => { },

  inputGutSearchWord: '',
  setInputGutSearchWord: () => { },

  inputGutSearchMaker: undefined,
  setInputGutSearchMaker: () => { },

  inputRacketSearchWord: '',
  setInputRacketSearchWord: () => { },

  inputRacketSearchMaker: undefined,
  setInputRacketSearchMaker: () => { },
}

const ReviewContext = createContext<ContextVals>(initialContextVals);

type Props = {
  children: ReactNode
}

const ReviewContextProvider: React.FC<Props> = ({ children }) => {
  const [reviewsPaginator, setReviewsPaginator] = useState<Paginator<Review>>();
  const [reviews, setReviews] = useState<Review[]>();

  // 各種検索結果state
  const [searchedGuts, setSearchedGuts] = useState<Gut[]>();

  const [searchedRackets, setSearchedRackets] = useState<Racket[]>();

  // 検索に使うstate群
  // 評価で検索に関するstate
  const [matchRate, setMatchRate] = useState<number>(1);
  const [pysicalDurability, setPysicalDurability] = useState<number>(1);
  const [performanceDurability, setPerformanceDurability] = useState<number>(1);

  // 装備で検索に関するstate
  const [stringingWay, setStringingWay] = useState<string>();
  const [mainGut, setMainGut] = useState<Gut>();
  const [crossGut, setCrossGut] = useState<Gut>();
  const [racket, setRacket] = useState<Racket>();

  // ユーザープロフィールで検索に関するstate
  const [experiencePeriod, setExperiencePeriod] = useState<number | undefined>();
  const [frequency, setFrequency] = useState<Frequency | undefined>();
  const [playStyle, setPlayStyle] = useState<PlayStyle | undefined>();
  const [gripForm, setGripForm] = useState<GripForm | undefined>();
  const [favaritShot, setFavaritShot] = useState<FavaritShot | undefined>();
  const [weakShot, setWeakShot] = useState<WeakShot | undefined>();
  const [age, setAge] = useState<Age | undefined>();
  const [gender, setGender] = useState<Gender | undefined>();
  const [height, setHeight] = useState<Height | undefined>();
  const [physique, setPhysique] = useState<Physique | undefined>();

  // レビュー検索モーダル内、ラケット、ガット検索モーダルinput値
  const [inputGutSearchWord, setInputGutSearchWord] = useState<string>('');
  const [inputGutSearchMaker, setInputGutSearchMaker] = useState<number>();
  const [inputRacketSearchWord, setInputRacketSearchWord] = useState<string>('');
  const [inputRacketSearchMaker, setInputRacketSearchMaker] = useState<number>();

  const contextVals = {
    reviewsPaginator,
    setReviewsPaginator,

    reviews,
    setReviews,

    searchedGuts,
    setSearchedGuts,

    searchedRackets,
    setSearchedRackets,

    matchRate,
    setMatchRate,

    pysicalDurability,
    setPysicalDurability,

    performanceDurability,
    setPerformanceDurability,

    stringingWay,
    setStringingWay,

    mainGut,
    setMainGut,

    crossGut,
    setCrossGut,

    racket,
    setRacket,

    inputGutSearchWord,
    setInputGutSearchWord,

    inputGutSearchMaker,
    setInputGutSearchMaker,

    inputRacketSearchWord,
    setInputRacketSearchWord,

    inputRacketSearchMaker,
    setInputRacketSearchMaker,

    experiencePeriod,
    setExperiencePeriod,

    frequency,
    setFrequency,

    playStyle,
    setPlayStyle,

    gripForm,
    setGripForm,

    favaritShot,
    setFavaritShot,

    weakShot,
    setWeakShot,

    age,
    setAge,

    gender,
    setGender,

    height,
    setHeight,

    physique,
    setPhysique,
  }

  return (
    <>
      <ReviewContext.Provider value={contextVals} >
        {children}
      </ReviewContext.Provider>
    </>
  );
}

export {
  ReviewContextProvider,
  ReviewContext
}
