import type { NextPage } from "next";
import type { User } from "@/context/AuthContext";
import type { TennisProfile } from "../profile";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import AuthCheck from "@/components/AuthCheck";

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

  useEffect(() => {
    const getTennisProfile = async () => {
      await axios.get(`api/tennis_profiles/${user.id}`).then(res => {
        setTennisProfile(res.data);
        setMyRacketId(res.data.my_racket_id);
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
      })
    }

    getTennisProfile();
  }, [])

  

  const [myRacketId, setMyRacketId] = useState<number | undefined>();
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

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  const onChangeFrequency = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frequencys: Frequency[] = ['未設定', '週１回', '週２回', '週３回', '週４回', '週５回', '週６回', '月１回', '月２回', '月３回', '月４回', "毎日"]

    //asでFrequency型に変換する前にインプット値のFrequency型との比較
    frequencys.forEach(frequency => {
      if (e.target.value === frequency) {
        setFrequency(e.target.value as Frequency);
      }
    })

    return
  }

  const onChangePlayStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const playStyles: PlayStyle[] = ['オールラウンダー', 'ストローカー', 'ビッグサーバー', 'サーブアンドボレーヤー', '未設定']

    //asでFrequency型に変換する前にインプット値のFrequency型との比較
    playStyles.forEach(playStyle => {
      if (e.target.value === playStyle) {
        setPlayStyle(e.target.value as PlayStyle);
      }
    })

    return
  }
  const onChangeGripForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gripForms: GripForm[] = ['未設定', 'コンチネンタル', 'イースタン', 'セミウェスタン', 'ウェスタン', 'フルウェスタン']

    gripForms.forEach(gripForm => {
      if (e.target.value === gripForm) {
        setGripForm(e.target.value as GripForm);
      }
    })

    return
  }

  const onChangeFavaritShot = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const favaritShots: FavaritShot[] = ['未設定', 'フォアハンド', 'バックハンド', 'サーブ', 'フォアハンドボレー', 'バックハンドボレー']

    favaritShots.forEach(favaritShot => {
      if (e.target.value === favaritShot) {
        setFavaritShot(e.target.value as FavaritShot);
      }
    })

    return
  }

  const onChangeWeakShot = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const weakShots: WeakShot[] = ['未設定', 'フォアハンド', 'バックハンド', 'サーブ', 'フォアハンドボレー', 'バックハンドボレー']

    weakShots.forEach(weakShot => {
      if (e.target.value === weakShot) {
        setWeakShot(e.target.value as WeakShot);
      }
    })

    return
  }

  const onChangeAge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ages: Age[] = ['未設定', '１０代前半', '１０代後半', '２０代前半', '２０代後半', '３０代前半', '３０代後半', '４０代前半', '４０代後半', '５０代前半', '５０代後半', '６０代以上'];

    ages.forEach(age => {
      if (e.target.value === age) {
        setAge(e.target.value as Age);
      }
    })

    return
  }

  const onChangeGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genders: Gender[] = ['未設定', '男', '女'];

    genders.forEach(gender => {
      if (e.target.value === gender) {
        setGender(e.target.value as Gender);
      }
    })

    return
  }

  const onChangeHeight = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const heights: Height[] = ['未設定', '高い', 'やや高い', '普通', 'やや小柄', '小柄'];

    heights.forEach(height => {
      if (e.target.value === height) {
        setHeight(e.target.value as Height);
      }
    })

    return
  }

  const onChangePhysique = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const physiques: Physique[] = ['未設定', '普通', 'がっしり'];

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
      my_racket_id: myRacketId,
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

    // await axios.post(`/api/users/${user.id}`, updatedData, {
    await axios.post(`/api/tennis_profiles/${user.id}`, updatedData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(async (res) => {
      router.push(`/users/${user.id}/profile`);
    }).catch((e) => {
      console.log(e);
      const newErrors = {...initialErrors, ...e.response.data.errors };
      setErrors(newErrors);

      console.log('基本プロフィール更新に失敗しました。');
    })
  }

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            <div className="container mx-auto">
              <div className="w-80 md:w-[500px] mx-auto flex flex-col md:justify-center">
                <div className="w-[320px] md:w-[500px] mb-16">
                  <h2 className="text-xl">テニスプロフィール</h2>
                  <hr className=" border-sub-green mb-6" />

                  <div className="flex flex-wrap justify-between mb-8">
                    <p className="mb-2 basis-full">使用ラケット</p>

                    <div className="w-28 h-40 bg-faint-green">
                      <img src={`${baseImagePath}images/rackets/defalt_racket_image.jpg`} width="112px" alt="ラケット画像" />
                    </div>

                    <div className="w-44 md:w-[360px] flex flex-col">
                      <span>選択中</span>
                      <div className="h-12 border rounded md:w-[360px]">
                        <span className="inline-block pl-2 text-xs ml-4 ">Babolat</span>
                        <p className="pl-2 leading-[18px] text-center">ピュアアエロ</p>
                      </div>

                      <div className="flex justify-end md:justify-start mt-auto">
                        {/* 今後、ラケットを選ぶを押すとモーダルなどでラケットを選択でき、選択したらstateのラケットidにidを格納する処理を実装する */}
                        <button className="text-white font-bold text-[14px] w-32 h-8 rounded  bg-sub-green">ラケットを選択</button>
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
                        <option value="未設定">未設定</option>
                        <option value="週１回">週１回</option>
                        <option value="週２回">週２回</option>
                        <option value="週３回">週３回</option>
                        <option value="週４回">週４回</option>
                        <option value="週５回">週５回</option>
                        <option value="週６回">週６回</option>
                        <option value="月１回">月１回</option>
                        <option value="月２回">月２回</option>
                        <option value="月３回">月３回</option>
                        <option value="月４回">月４回</option>
                        <option value="毎日">毎日</option>
                      </select>
                      {errors.frequency.length !== 0 &&
                        errors.frequency.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="play_style" className="block">プレースタイル</label>
                      <select name="play_style" id="play_style" onChange={onChangePlayStyle} value={playStyle} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        <option value="未設定">未設定</option>
                        <option value="オールラウンダー">オールラウンダー</option>
                        <option value="ストローカー">ストローカー</option>
                        <option value="ビッグサーバー">ビッグサーバー</option>
                        <option value="サーブアンドボレーヤー">サーブアンドボレーヤー</option>
                      </select>
                      {errors.play_style.length !== 0 &&
                        errors.play_style.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="grip_form" className="block">グリップ</label>
                      <select name="grip_form" id="grip_form" onChange={onChangeGripForm} value={gripForm} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        <option value="未設定">未設定</option>
                        <option value="コンチネンタル">コンチネンタル</option>
                        <option value="イースタン">イースタン</option>
                        <option value="セミウェスタン">セミウェスタン</option>
                        <option value="ウェスタン">ウェスタン</option>
                        <option value="フルウェスタン">フルウェスタン</option>
                      </select>
                      {errors.grip_form.length !== 0 &&
                        errors.grip_form.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="favarit_shot" className="block">好きなショット</label>
                      <select name="favarit_shot" id="favarit_shot" onChange={onChangeFavaritShot} value={favaritShot} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        <option value="未設定">未設定</option>
                        <option value="フォアハンド">フォアハンド</option>
                        <option value="バックハンド">バックハンド</option>
                        <option value="サーブ">サーブ</option>
                        <option value="フォアハンドボレー">フォアハンドボレー</option>
                        <option value="バックハンドボレー">バックハンドボレー</option>
                      </select>
                      {errors.favarit_shot.length !== 0 &&
                        errors.favarit_shot.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="weak_shot" className="block">苦手なショット</label>
                      <select name="weak_shot" id="weak_shot" onChange={onChangeWeakShot} value={weakShot} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        <option value="未設定">未設定</option>
                        <option value="フォアハンド">フォアハンド</option>
                        <option value="バックハンド">バックハンド</option>
                        <option value="サーブ">サーブ</option>
                        <option value="フォアハンドボレー">フォアハンドボレー</option>
                        <option value="バックハンドボレー">バックハンドボレー</option>
                      </select>
                      {errors.weak_shot.length !== 0 &&
                        errors.weak_shot.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="age" className="block">年齢</label>
                      <select name="age" id="age" onChange={onChangeAge} value={age} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        <option value="未設定">未設定</option>
                        <option value="１０代前半">１０代前半</option>
                        <option value="１０代後半">１０代後半</option>
                        <option value="２０代前半">２０代前半</option>
                        <option value="２０代後半">２０代後半</option>
                        <option value="３０代前半">３０代前半</option>
                        <option value="３０代後半">３０代後半</option>
                        <option value="４０代前半">４０代前半</option>
                        <option value="４０代後半">４０代後半</option>
                        <option value="５０代前半">５０代前半</option>
                        <option value="５０代後半">５０代後半</option>
                        <option value="６０代以上">６０代以上</option>
                      </select>
                      {errors.age.length !== 0 &&
                        errors.age.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="gender" className="block">性別</label>
                      <select name="gender" id="gender" onChange={onChangeGender} value={gender} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        <option value="未設定">未設定</option>
                        <option value="男">男</option>
                        <option value="女">女</option>
                      </select>
                      {errors.gender.length !== 0 &&
                        errors.gender.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="height" className="block">背丈</label>
                      <select name="height" id="height" onChange={onChangeHeight} value={height} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        <option value="未設定">未設定</option>
                        <option value="高い">高い</option>
                        <option value="やや高い">やや高い</option>
                        <option value="普通">普通</option>
                        <option value="やや小柄">やや小柄</option>
                        <option value="小柄">小柄</option>
                      </select>
                      {errors.height.length !== 0 &&
                        errors.height.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="physique" className="block">体格</label>
                      <select name="physique" id="physique" onChange={onChangePhysique} value={physique} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                        <option value="未設定">未設定</option>
                        <option value="普通">普通</option>
                        <option value="がっしり">がっしり</option>
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
              </div>
            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default TennisProfileEdit;
