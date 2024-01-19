import { Age, FavaritShot, Frequency, Gender, GripForm, Height, Physique, PlayStyle, WeakShot } from "@/pages/users/[id]/edit/tennis_profile";
import { useState } from "react";

const useTennisProfileForm = () => {
  const frequencys: Frequency[] = ['未設定', '週１回', '週２回', '週３回', '週４回', '週５回', '週６回', '月１回', '月２回', '月３回', '月４回', "毎日"]
  const playStyles: PlayStyle[] = ['未設定', 'オールラウンダー', 'ストローカー', 'ビッグサーバー', 'サーブアンドボレーヤー']
  const gripForms: GripForm[] = ['未設定', 'コンチネンタル', 'イースタン', 'セミウェスタン', 'ウェスタン', 'フルウェスタン']
  const favaritShots: FavaritShot[] = ['未設定', 'フォアハンド', 'バックハンド', 'サーブ', 'フォアハンドボレー', 'バックハンドボレー']
  const weakShots: WeakShot[] = ['未設定', 'フォアハンド', 'バックハンド', 'サーブ', 'フォアハンドボレー', 'バックハンドボレー']
  const ages: Age[] = ['未設定', '１０代前半', '１０代後半', '２０代前半', '２０代後半', '３０代前半', '３０代後半', '４０代前半', '４０代後半', '５０代前半', '５０代後半', '６０代以上'];
  const genders: Gender[] = ['未設定', '男', '女'];
  const heights: Height[] = ['未設定', '高い', 'やや高い', '普通', 'やや小柄', '小柄'];
  const physiques: Physique[] = ['未設定', '普通', 'がっしり'];

  const onChangeExperiencePeriod = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number | undefined>>
  ) => {
    setState(Number(e.target.value));
  }

  const onChangeFrequency = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<Frequency | undefined>>
  ) => {
    //asでFrequency型に変換する前にインプット値のFrequency型との比較
    frequencys.forEach(frequency => {
      if (e.target.value === frequency) {
        setState(e.target.value as Frequency);
      }
    })

    return
  }

  const onChangePlayStyle = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<PlayStyle | undefined>>
  ) => {
    playStyles.forEach(playStyle => {
      if (e.target.value === playStyle) {
        setState(e.target.value as PlayStyle);
      }
    })

    return
  }

  const onChangeGripForm = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<GripForm | undefined>>
  ) => {
    gripForms.forEach(gripForm => {
      if (e.target.value === gripForm) {
        setState(e.target.value as GripForm);
      }
    })

    return
  }

  const onChangeFavaritShot = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<FavaritShot | undefined>>
    ) => {
    favaritShots.forEach(favaritShot => {
      if (e.target.value === favaritShot) {
        setState(e.target.value as FavaritShot);
      }
    })

    return
  }

  const onChangeWeakShot = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<WeakShot | undefined>>
  ) => {
    weakShots.forEach(weakShot => {
      if (e.target.value === weakShot) {
        setState(e.target.value as WeakShot);
      }
    })

    return
  }

  const onChangeAge = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<Age | undefined>>
  ) => {
    ages.forEach(age => {
      if (e.target.value === age) {
        setState(e.target.value as Age);
      }
    })

    return
  }

  const onChangeGender = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<Gender | undefined>>
  ) => {
    genders.forEach(gender => {
      if (e.target.value === gender) {
        setState(e.target.value as Gender);
      }
    })

    return
  }

  const onChangeHeight = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<Height | undefined>>
  ) => {
    heights.forEach(height => {
      if (e.target.value === height) {
        setState(e.target.value as Height);
      }
    })

    return
  }

  const onChangePhysique = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<Physique | undefined>>
  ) => {
    physiques.forEach(physique => {
      if (e.target.value === physique) {
        setState(e.target.value as Physique);
      }
    })

    return
  }

  return {
    // form、input変更メソッド関連
    onChangeExperiencePeriod,
    onChangeFrequency,
    onChangePlayStyle,
    onChangeGripForm,
    onChangeFavaritShot,
    onChangeWeakShot,
    onChangeAge,
    onChangeGender,
    onChangeHeight,
    onChangePhysique,

    // リテラル型のユニオンにある値を配列で表したもの
    frequencys,
    playStyles,
    gripForms,
    favaritShots,
    weakShots,
    ages,
    genders,
    heights,
    physiques,
  }
}

export default useTennisProfileForm;


// import { Age, FavaritShot, Frequency, Gender, GripForm, Height, Physique, PlayStyle, WeakShot } from "@/pages/users/[id]/edit/tennis_profile";
// import { useState } from "react";

// const useTennisProfileForm = () => {
//   const [experiencePeriod, setExperiencePeriod] = useState<number | undefined>();
//   const [frequency, setFrequency] = useState<Frequency | undefined>();
//   const [playStyle, setPlayStyle] = useState<PlayStyle | undefined>();
//   const [gripForm, setGripForm] = useState<GripForm | undefined>();
//   const [favaritShot, setFavaritShot] = useState<FavaritShot | undefined>();
//   const [weakShot, setWeakShot] = useState<WeakShot | undefined>();
//   const [age, setAge] = useState<Age | undefined>();
//   const [gender, setGender] = useState<Gender | undefined>();
//   const [height, setHeight] = useState<Height | undefined>();
//   const [physique, setPhysique] = useState<Physique | undefined>();

//   const frequencys: Frequency[] = ['未設定', '週１回', '週２回', '週３回', '週４回', '週５回', '週６回', '月１回', '月２回', '月３回', '月４回', "毎日"]
//   const playStyles: PlayStyle[] = ['未設定', 'オールラウンダー', 'ストローカー', 'ビッグサーバー', 'サーブアンドボレーヤー']
//   const gripForms: GripForm[] = ['未設定', 'コンチネンタル', 'イースタン', 'セミウェスタン', 'ウェスタン', 'フルウェスタン']
//   const favaritShots: FavaritShot[] = ['未設定', 'フォアハンド', 'バックハンド', 'サーブ', 'フォアハンドボレー', 'バックハンドボレー']
//   const weakShots: WeakShot[] = ['未設定', 'フォアハンド', 'バックハンド', 'サーブ', 'フォアハンドボレー', 'バックハンドボレー']
//   const ages: Age[] = ['未設定', '１０代前半', '１０代後半', '２０代前半', '２０代後半', '３０代前半', '３０代後半', '４０代前半', '４０代後半', '５０代前半', '５０代後半', '６０代以上'];
//   const genders: Gender[] = ['未設定', '男', '女'];
//   const heights: Height[] = ['未設定', '高い', 'やや高い', '普通', 'やや小柄', '小柄'];
//   const physiques: Physique[] = ['未設定', '普通', 'がっしり'];

//   const onChangeExperiencePeriod = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setExperiencePeriod(Number(e.target.value));
//   }

//   const onChangeFrequency = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     //asでFrequency型に変換する前にインプット値のFrequency型との比較
//     frequencys.forEach(frequency => {
//       if (e.target.value === frequency) {
//         setFrequency(e.target.value as Frequency);
//       }
//     })

//     return
//   }

//   const onChangePlayStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     playStyles.forEach(playStyle => {
//       if (e.target.value === playStyle) {
//         setPlayStyle(e.target.value as PlayStyle);
//       }
//     })

//     return
//   }

//   const onChangeGripForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     gripForms.forEach(gripForm => {
//       if (e.target.value === gripForm) {
//         setGripForm(e.target.value as GripForm);
//       }
//     })

//     return
//   }

//   const onChangeFavaritShot = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     favaritShots.forEach(favaritShot => {
//       if (e.target.value === favaritShot) {
//         setFavaritShot(e.target.value as FavaritShot);
//       }
//     })

//     return
//   }

//   const onChangeWeakShot = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     weakShots.forEach(weakShot => {
//       if (e.target.value === weakShot) {
//         setWeakShot(e.target.value as WeakShot);
//       }
//     })

//     return
//   }

//   const onChangeAge = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     ages.forEach(age => {
//       if (e.target.value === age) {
//         setAge(e.target.value as Age);
//       }
//     })

//     return
//   }

//   const onChangeGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     genders.forEach(gender => {
//       if (e.target.value === gender) {
//         setGender(e.target.value as Gender);
//       }
//     })

//     return
//   }

//   const onChangeHeight = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     heights.forEach(height => {
//       if (e.target.value === height) {
//         setHeight(e.target.value as Height);
//       }
//     })

//     return
//   }

//   const onChangePhysique = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     physiques.forEach(physique => {
//       if (e.target.value === physique) {
//         setPhysique(e.target.value as Physique);
//       }
//     })

//     return
//   }

//   return {
//     // state値
//     experiencePeriod,
//     frequency,
//     playStyle,
//     gripForm,
//     favaritShot,
//     weakShot,
//     age,
//     gender,
//     height,
//     physique,

//     // setState関数
//     setExperiencePeriod,
//     setFrequency,
//     setPlayStyle,
//     setGripForm,
//     setFavaritShot,
//     setWeakShot,
//     setAge,
//     setGender,
//     setHeight,
//     setPhysique,

//     // form、input変更メソッド関連
//     onChangeExperiencePeriod,
//     onChangeFrequency,
//     onChangePlayStyle,
//     onChangeGripForm,
//     onChangeFavaritShot,
//     onChangeWeakShot,
//     onChangeAge,
//     onChangeGender,
//     onChangeHeight,
//     onChangePhysique,

//     // リテラル型のユニオンにある値を配列で表したもの
//     frequencys,
//     playStyles,
//     gripForms,
//     favaritShots,
//     weakShots,
//     ages,
//     genders,
//     heights,
//     physiques,
//   }
// }

// export default useTennisProfileForm;
