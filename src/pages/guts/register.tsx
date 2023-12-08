import type { Maker } from "../users/[id]/profile";

import AuthAdminCheck from "@/components/AuthAdminCheck";
import PrimaryHeading from "@/components/PrimaryHeading";
import { AuthContext } from "@/context/AuthContext";
import axios from "@/lib/axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const GutRegister: NextPage = () => {
  const router = useRouter();

  const [inputNameJa, setInputNameJa] = useState<string>('');
  
  const [inputNameEn, setInputNameEn] = useState<string>('');
  
  const [gutMakerId, setGutMakerId] = useState<number | null>(null);
  
  const [needPostingImage, setNeedPostingImage] = useState<boolean>(true);
  
  const [makers, setMakers] = useState<Maker[]>();

  const [gutImageId, setGutImageId] = useState<number>();

  console.log('makers', makers)
  console.log('inputNameJa', inputNameJa);
  console.log('inputNameEn', inputNameEn);
  console.log('gutMakerId', gutMakerId);
  console.log('needPostingImage', needPostingImage);
  console.log('gutImageId', gutImageId);

  const { admin, isAuthAdmin, } = useContext(AuthContext);

  useEffect(() => {
    if (admin.id) {
      const getGutList = async () => {
        await axios.get('api/makers').then(res => {
          setMakers(res.data);
        })
      }

      getGutList();
    } else {
      router.push('/admins/login')
    }
  }, [])

  const onChangeMaker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value === '未選択') {
      setGutMakerId(null);
      return 
    };

    setGutMakerId(Number(e.target.value));
  }


  return (
    <>
      <AuthAdminCheck>
        {isAuthAdmin && (
          <>

            <div className="container mx-auto mb-8">
              <div className="text-center mb-6">
                <PrimaryHeading text="ストリング登録" className="text-[18px] h-[20px] md:text-[20px] md:h-[22px]" />
              </div>
              
              <div className="w-[100%] max-w-[320px] md:w-[500px] mx-auto flex flex-col md:justify-center">
                <form action="" >
                  <div className="mb-6">
                    <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ストリング名(カナ)</label>
                    <input type="text" name="name_ja" onChange={(e) => setInputNameJa(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    {/* {errors.title.length !== 0 &&
                        errors.title.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="name_ja" className="block mb-1 text-[14px] md:text-[16px] md:mb-2">ストリング名(アルファベット)</label>
                    <input type="text" name="name_ja" onChange={(e) => setInputNameEn(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    {/* {errors.title.length !== 0 &&
                        errors.title.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                  </div>

                  <div className=" mb-8">
                    <label htmlFor="maker" className="block">メーカー</label>

                    <select name="maker" id="maker" onChange={(e) => { onChangeMaker(e) }} className=" border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green">
                      <option value="未選択" selected>未選択</option>
                      {makers?.map((maker) => (<option key={maker.id} value={maker.id}>{maker.name_ja}</option>))}
                    </select>

                    {/* {errors.grip_form.length !== 0 &&
                        errors.grip_form.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      } */}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="need_posting_image">画像提供受付</label>
                    <input type="checkbox" name="need_posting_image" id="need_posting_image" defaultChecked={needPostingImage} onChange={(e) => setNeedPostingImage(prev => !prev) } />
                  </div>
                  
                  {/* 画像選択 */}
                  <div className="mb-[64px]">
                    <input type="hidden" name="image_id"  />

                    <div>
                      <p className="mb-2">選択中：{}</p>
                      <div className="flex justify-between">
                        <div className="self-end">
                          <button type="button" className="text-white font-bold text-[14px] w-[80px] h-6 rounded  bg-sub-green">変更</button>
                        </div>

                        <div className="w-[100%] max-w-[200px] h-[120px] flex justify-center">
                          <img src="" alt="" className="w-[100%] max-w-[120px] border" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button type="submit" className="text-white font-bold text-[14px] w-[200px] h-8 rounded  bg-sub-green">登録</button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </AuthAdminCheck>
    </>
  );
}

export default GutRegister;
