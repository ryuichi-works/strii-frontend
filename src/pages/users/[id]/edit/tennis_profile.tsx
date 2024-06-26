import type { NextPage } from "next";
import type { User } from "@/context/AuthContext";
import type { Maker, Racket, TennisProfile } from "../profile";
import type { RacketSeries } from "@/types/global";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Head from 'next/head'
import AuthCheck from "@/components/AuthCheck";
import { IoClose } from "react-icons/io5";
import TextUnderBar from "@/components/TextUnderBar";
import Pagination, { Paginator } from "@/components/Pagination";
import RacketSearchModal from "@/components/RacketSearchModal";
import RacketRegisterModal from "@/components/RacketRegisterModal";

//注意：文字列の数字は全角
export type Frequency = '未設定' | '週１回' | '週２回' | '週３回' | '週４回' | '週５回' | '週６回' | '月１回' | '月２回' | '月３回' | '月４回' | '毎日';
export type PlayStyle = 'オールラウンダー' | 'ストローカー' | 'ビッグサーバー' | 'サーブアンドボレーヤー' | '未設定';
export type GripForm = '未設定' | 'コンチネンタル' | 'イースタン' | 'セミウェスタン' | 'ウェスタン' | 'フルウェスタン';
export type FavaritShot = '未設定' | 'フォアハンド' | 'バックハンド' | 'サーブ' | 'フォアハンドボレー' | 'バックハンドボレー';
export type WeakShot = '未設定' | 'フォアハンド' | 'バックハンド' | 'サーブ' | 'フォアハンドボレー' | 'バックハンドボレー';
export type Age = '未設定' | '１０代前半' | '１０代後半' | '２０代前半' | '２０代後半' | '３０代前半' | '３０代後半' | '４０代前半' | '４０代後半' | '５０代前半' | '５０代後半' | '６０代以上';
export type Gender = '未設定' | '男' | '女';
export type Height = '未設定' | '高い' | 'やや高い' | '普通' | 'やや小柄' | '小柄';
export type Physique = '未設定' | '普通' | 'がっしり';

const TennisProfileEdit: NextPage = () => {
  const router = useRouter();

  const { isAuth, user, setUser, setIsAuth } = useContext(AuthContext);

  const [tennisProfile, setTennisProfile] = useState<TennisProfile>();

  //要素の表示などに使用するstate群
  const [makers, setMakers] = useState<Maker[]>();

  const [racketSeries, setRacketSeries] = useState<RacketSeries[]>();
  console.log('racketSeries', racketSeries)

  const [racket, setRacket] = useState<Racket>();

  //検索関連のstate
  const [inputSearchWord, setInputSearchWord] = useState<string>('');

  const [inputSearchMaker, setInputSearchMaker] = useState<number>();

  const [searchedRackets, setSearchedRackets] = useState<Racket[]>();

  //モーダルの開閉に関するstate
  const [racketSearchModalVisibility, setRacketSearchModalVisibility] = useState<boolean>(false);

  const [RacketRegisterModalVisibility, setRacketRegisterModalVisibility] = useState<boolean>(false);

  useEffect(() => {
    if (user.id) {
      const getTennisProfile = async () => {
        await axios.get(`api/tennis_profiles/user/${user.id}`).then(res => {
          setTennisProfile(res.data);
          setExperiencePeriod(res.data.experience_period);
          setFrequency(res.data.frequency);
          setPlayStyle(res.data.play_style);
          setGripForm(res.data.grip_form);
          setFavaritShot(res.data.favarit_shot);
          setWeakShot(res.data.weak_shot);
          setAge(res.data.age);
          setGender(res.data.gender);
          setHeight(res.data.height);
          setPhysique(res.data.physique);
          setRacket(res.data.racket)
        })
      }

      const getMakerList = async () => {
        await axios.get('api/makers').then(res => {
          setMakers(res.data);
        })
      }

      const getRacketSeries = async () => {
        await axios.get('api/racket_series').then(res => {
          setRacketSeries(res.data);
        })
      }

      getTennisProfile();
      getMakerList();
      getRacketSeries();
    } else {
      router.push('/users/login')
    }
  }, [])

  // racket検索モーダル開閉とその時の背景の縦スクロールの挙動を考慮している
  useEffect(() => {
    if (racketSearchModalVisibility) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [racketSearchModalVisibility])

  // ラケット検索モーダルの開閉
  const openRacketSearchModal = () => {
    setRacketSearchModalVisibility(true);
  }

  const closeRacketSearchModal = () => {
    setRacketSearchModalVisibility(false);
  }

  const afterRegistringRacketHandler = (racket?: Racket) => {
    if (racket) {
      setRacket(racket)
    }
    setRacketSearchModalVisibility(false);
  }

  const selectRacket = (racket: Racket) => {
    setRacket(racket)
    closeRacketSearchModal();
  }

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

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

  const frequencys: Frequency[] = ['未設定', '週１回', '週２回', '週３回', '週４回', '週５回', '週６回', '月１回', '月２回', '月３回', '月４回', "毎日"]
  const playStyles: PlayStyle[] = ['オールラウンダー', 'ストローカー', 'ビッグサーバー', 'サーブアンドボレーヤー', '未設定']
  const gripForms: GripForm[] = ['未設定', 'コンチネンタル', 'イースタン', 'セミウェスタン', 'ウェスタン', 'フルウェスタン']
  const favaritShots: FavaritShot[] = ['未設定', 'フォアハンド', 'バックハンド', 'サーブ', 'フォアハンドボレー', 'バックハンドボレー']
  const weakShots: WeakShot[] = ['未設定', 'フォアハンド', 'バックハンド', 'サーブ', 'フォアハンドボレー', 'バックハンドボレー']
  const ages: Age[] = ['未設定', '１０代前半', '１０代後半', '２０代前半', '２０代後半', '３０代前半', '３０代後半', '４０代前半', '４０代後半', '５０代前半', '５０代後半', '６０代以上'];
  const genders: Gender[] = ['未設定', '男', '女'];
  const heights: Height[] = ['未設定', '高い', 'やや高い', '普通', 'やや小柄', '小柄'];
  const physiques: Physique[] = ['未設定', '普通', 'がっしり'];

  const onChangeFrequency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //asでFrequency型に変換する前にインプット値のFrequency型との比較
    frequencys.forEach(frequency => {
      if (e.target.value === frequency) {
        setFrequency(e.target.value as Frequency);
      }
    })

    return
  }

  const onChangePlayStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playStyles.forEach(playStyle => {
      if (e.target.value === playStyle) {
        setPlayStyle(e.target.value as PlayStyle);
      }
    })

    return
  }

  const onChangeGripForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
    gripForms.forEach(gripForm => {
      if (e.target.value === gripForm) {
        setGripForm(e.target.value as GripForm);
      }
    })

    return
  }

  const onChangeFavaritShot = (e: React.ChangeEvent<HTMLSelectElement>) => {
    favaritShots.forEach(favaritShot => {
      if (e.target.value === favaritShot) {
        setFavaritShot(e.target.value as FavaritShot);
      }
    })

    return
  }

  const onChangeWeakShot = (e: React.ChangeEvent<HTMLSelectElement>) => {
    weakShots.forEach(weakShot => {
      if (e.target.value === weakShot) {
        setWeakShot(e.target.value as WeakShot);
      }
    })

    return
  }

  const onChangeAge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    ages.forEach(age => {
      if (e.target.value === age) {
        setAge(e.target.value as Age);
      }
    })

    return
  }

  const onChangeGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
    genders.forEach(gender => {
      if (e.target.value === gender) {
        setGender(e.target.value as Gender);
      }
    })

    return
  }

  const onChangeHeight = (e: React.ChangeEvent<HTMLSelectElement>) => {
    heights.forEach(height => {
      if (e.target.value === height) {
        setHeight(e.target.value as Height);
      }
    })

    return
  }

  const onChangePhysique = (e: React.ChangeEvent<HTMLSelectElement>) => {
    physiques.forEach(physique => {
      if (e.target.value === physique) {
        setPhysique(e.target.value as Physique);
      }
    })

    return
  }

  type Errors = {
    my_racket_id: string[],
    experience_period: string[],
    frequency: string[],
    play_style: string[],
    grip_form: string[],
    favarit_shot: string[],
    weak_shot: string[],
    age: string[],
    gender: string[],
    height: string[],
    physique: string[],
  }

  const initialErrors = {
    my_racket_id: [],
    experience_period: [],
    frequency: [],
    play_style: [],
    grip_form: [],
    favarit_shot: [],
    weak_shot: [],
    age: [],
    gender: [],
    height: [],
    physique: [],
  }

  const [errors, setErrors] = useState<Errors>(initialErrors);

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const updateTennisProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = {
      _method: 'PUT',
      my_racket_id: racket?.id,
      experience_period: experiencePeriod,
      frequency: frequency,
      play_style: playStyle,
      grip_form: gripForm,
      favarit_shot: favaritShot,
      weak_shot: weakShot,
      age: age,
      gender: gender,
      height: height,
      physique: physique,
    }

    await csrf();

    await axios.post(`/api/tennis_profiles/${tennisProfile?.id}`, updatedData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(async (res) => {
      router.push(`/users/${user.id}/profile`);
    }).catch((e) => {
      console.log(e);
      const newErrors = { ...initialErrors, ...e.response.data.errors };
      setErrors(newErrors);

      console.log('基本プロフィール更新に失敗しました。');
    })
  }

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <Head>
              <title>strii(ストリー) - テニスプロフィール編集</title>
            </Head>

            <div className="container mx-auto">
              <div className="w-80 mt-[24px] md:w-[500px] mx-auto flex flex-col md:justify-center md:mt-[48px]">
                <div className="w-[320px] md:w-[500px] mb-16">
                  <h2 className="text-xl">テニスプロフィール</h2>
                  <hr className=" border-sub-green mb-6" />

                  {/* ラケット選択 */}
                  <div className="flex flex-wrap justify-between mb-8">
                    <p className="mb-2 basis-full">使用ラケット</p>

                    <div className="w-[100%] max-w-[120px] h-[160px] bg-faint-green">
                      {racket && racket.racket_image.file_path
                        ? <img src={`${racket.racket_image.file_path}`} alt="ラケット画像" className="w-[120px] h-[160px]" />
                        : <img src={`${baseImagePath}images/rackets/default_racket_image.png`} alt="ラケット画像" className="w-[120px] h-[160px]" />
                      }
                    </div>

                    <div className="w-44 md:w-[360px] flex flex-col">
                      <span>選択中</span>
                      <div className="h-12 border rounded md:w-[360px]">
                        <span className="inline-block pl-2 text-xs ml-4 ">{racket ? racket.maker.name_en : ''}</span>
                        <p className="pl-2 leading-[18px] text-center">{racket ? racket.name_ja : '未選択'}</p>
                      </div>

                      <div className="flex justify-end md:justify-start mt-auto">
                        <button type="button" onClick={openRacketSearchModal} className="text-white font-bold text-[14px] w-32 h-8 rounded  bg-sub-green">ラケットを選択</button>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={updateTennisProfile}>
                    <div className="mb-6">
                      <label htmlFor="experience_period" className="block">テニス歴</label>

                      <input type="number" name="experience_period" onChange={(e) => setExperiencePeriod(Number(e.target.value))} min="0" max="100" defaultValue={experiencePeriod} className="border border-gray-300 rounded w-40 h-10 p-2 focus:outline-sub-green" />
                      <span className="ml-4">年</span>

                      {errors.experience_period.length !== 0 &&
                        errors.experience_period.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="frequency" className="block">テニス頻度</label>

                      <select name="frequency" id="frequency" value={frequency} onChange={onChangeFrequency} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        {frequencys.map(_frequency => (<option key={_frequency} value={_frequency}>{_frequency}</option>))}
                      </select>

                      {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="play_style" className="block">プレースタイル</label>

                      <select name="play_style" id="play_style" onChange={onChangePlayStyle} value={playStyle} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        {playStyles.map(_playStyle => (<option key={_playStyle} value={_playStyle}>{_playStyle}</option>))}
                      </select>

                      {errors.play_style.length !== 0 &&
                        errors.play_style.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="grip_form" className="block">グリップ</label>

                      <select name="grip_form" id="grip_form" onChange={onChangeGripForm} value={gripForm} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        {gripForms.map(_gripForm => (<option key={_gripForm} value={_gripForm}>{_gripForm}</option>))}
                      </select>

                      {errors.grip_form.length !== 0 &&
                        errors.grip_form.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="favarit_shot" className="block">好きなショット</label>

                      <select name="favarit_shot" id="favarit_shot" onChange={onChangeFavaritShot} value={favaritShot} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        {favaritShots.map(_favaritShot => (<option key={_favaritShot} value={_favaritShot}>{_favaritShot}</option>))}
                      </select>

                      {errors.favarit_shot.length !== 0 &&
                        errors.favarit_shot.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="weak_shot" className="block">苦手なショット</label>

                      <select name="weak_shot" id="weak_shot" onChange={onChangeWeakShot} value={weakShot} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        {weakShots.map(_weakShot => (<option key={_weakShot} value={_weakShot}>{_weakShot}</option>))}
                      </select>

                      {errors.weak_shot.length !== 0 &&
                        errors.weak_shot.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="age" className="block">年齢</label>

                      <select name="age" id="age" onChange={onChangeAge} value={age} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        {ages.map(_age => (<option key={_age} value={_age}>{_age}</option>))}
                      </select>

                      {errors.age.length !== 0 &&
                        errors.age.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="gender" className="block">性別</label>

                      <select name="gender" id="gender" onChange={onChangeGender} value={gender} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        {genders.map(_gender => (<option key={_gender} value={_gender}>{_gender}</option>))}
                      </select>

                      {errors.gender.length !== 0 &&
                        errors.gender.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="height" className="block">背丈</label>

                      <select name="height" id="height" onChange={onChangeHeight} value={height} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        {heights.map(_height => (<option key={_height} value={_height}>{_height}</option>))}
                      </select>

                      {errors.height.length !== 0 &&
                        errors.height.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="physique" className="block">体格</label>

                      <select name="physique" id="physique" onChange={onChangePhysique} value={physique} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        {physiques.map(_physique => (<option key={_physique} value={_physique}>{_physique}</option>))}
                      </select>

                      {errors.physique.length !== 0 &&
                        errors.physique.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="flex justify-end md:justify-start">
                      <button type="submit" className="text-white text-[14px] w-[192px] h-8 rounded  bg-sub-green">変更する</button>
                    </div>
                  </form>
                </div>

                {/* racket検索モーダル */}
                <RacketSearchModal
                  modalVisibility={racketSearchModalVisibility}
                  setModalVisibility={setRacketSearchModalVisibility}
                  makers={makers}
                  selectRacketHandler={selectRacket}
                  showingResult={true}
                  searchedRackets={searchedRackets}
                  setSearchedRackets={setSearchedRackets}
                  zIndexClassName="z-60"
                  inputSearchWord={inputSearchWord}
                  setInputSearchWord={setInputSearchWord}
                  inputSearchMaker={inputSearchMaker}
                  setInputSearchMaker={setInputSearchMaker}
                  setRacketRegisterModalVisibility={setRacketRegisterModalVisibility}
                />

                <RacketRegisterModal
                  modalVisibility={RacketRegisterModalVisibility}
                  setModalVisibility={setRacketRegisterModalVisibility}
                  makers={makers}
                  zIndexClassName="z-70"
                  racketSeries={racketSeries}
                  afterRegistringHandler={afterRegistringRacketHandler}
                />
              </div>
            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default TennisProfileEdit;
