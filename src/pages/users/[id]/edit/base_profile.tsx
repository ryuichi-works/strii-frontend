import type { NextPage } from "next";
import type { User } from "@/context/AuthContext";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import AuthCheck from "@/components/AuthCheck";

const BaseProfileEdit: NextPage = () => {
  const router = useRouter();

  const { isAuth, user, setUser, setIsAuth } = useContext(AuthContext);
  
  const [name, setName] = useState<string>(`${user.name}`);
  const [email, setEmail] = useState<string>(`${user.email}`);
  const [file, setFile] = useState<File | null>(null);

  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'

  type Errors = {
    name: string[],
    email: string[],
    password: string[]
    file: string[]
  }

  const [errors, setErrors] = useState<Errors>({ name: [], email: [], password: [], file: [] });

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setFile(files[0])
    }
    console.log(file);
  }

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const updateBaseProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedData = {
      _method: 'PUT',
      name: name,
      email: email,
      file: file,
    }

    await csrf();

    await axios.post(`/api/users/${user.id}`, updatedData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
        'Content-Type': 'multipart/form-data;'
      }
    }).then(async (res) => {
      await axios.get('/api/user').then(res => {

        const user: User = res.data;

        setUser(user);

        setIsAuth(true);

        router.push(`/users/${user.id}/profile`);
      })
    }).catch((e) => {
      console.log(e);
      const newErrors = {name: [], email: [], password: [], file: [], ...e.response.data.errors };
      setErrors(newErrors);

      console.log('基本プロフィール更新に失敗しました。');
    })
  }

  return (
    <>
      <AuthCheck>
        {isAuth && (
          <>
            {/* <h1>プロフィールページ</h1> */}
            <div className="container mx-auto">
              <div className="w-80 md:w-[500px] mx-auto flex flex-col md:justify-center">
                <div className="w-[320px] md:w-[500px] mb-16">
                  <h2 className="text-xl">基本プロフィール</h2>
                  <hr className=" border-sub-green mb-6" />

                  <div className="w-16 md:w-20 mx-auto mb-4">
                    {user.file_path
                      ? <img src={`${baseImagePath}${user.file_path}`} alt="ユーザープロフィール画像" className="rounded-full mb-2 w-16 md:w-20 h-16 md:h-20" />
                      : <img src={`${baseImagePath}images/users/defalt_user_image.jpg`} width="64px" height="64px" alt="ユーザープロフィール画像" className="rounded-full mb-2 w-16 md:w-20 h-16 md:h-20" />
                    }
                    <div className="w-8 h-1 bg-sub-green mx-auto"></div>
                  </div>

                  <form onSubmit={updateBaseProfile}>
                    <div className="flex flex-col mb-6">
                      <label htmlFor="">プロフィール画像</label>
                      <input type="file" name="file" accept=".jpg, .jpeg, .png" onChange={onChangeFile} className=" h-8" />
                      {errors.file.length !== 0 &&
                        errors.file.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="mb-6">
                      <label htmlFor="name" className="block">アカウント名</label>
                      <input type="text" name="name" defaultValue={user.name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                      {errors.name.length !== 0 &&
                        errors.name.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className=" mb-8">
                      <label htmlFor="email" className="block">メールアドレス</label>
                      <input type="email" name="email" defaultValue={user.email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                      {errors.email.length !== 0 &&
                        errors.email.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
                      }
                    </div>

                    <div className="flex justify-end md:justify-start">
                      <button type="submit" className="text-white text-[14px] w-[192px] h-8 rounded  bg-sub-green">基本プロフィールを変更する</button>
                    </div>
                  </form>
                </div>

                <div className="w-[320px] md:w-[500px]">
                  <h2 className="text-xl">パスワード変更</h2>
                  <hr className=" border-sub-green mb-6" />

                  <form action="">
                    <div className="mb-6">
                      <label htmlFor="current_password" className="block">現在のパスワード</label>
                      <input type="password" name="current_password" className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green" />
                    </div>

                    <div>
                      <label htmlFor="password" className="block">新しいパスワード</label>
                      <input type="password" name="password" className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green mb-8" />
                    </div>

                    <div>
                      <label htmlFor="password_confirmation" className="block">新しいパスワード確認</label>
                      <input type="password" name="password_confirmation" className="border border-gray-300 rounded w-80 md:w-[380px] h-10 p-2 focus:outline-sub-green mb-8" />
                    </div>

                    <div className="flex justify-end md:justify-start">
                      <button className="text-white text-[14px] w-[160px] h-8 rounded  bg-sub-green">パスワードを変更する</button>
                    </div>
                  </form>
                </div>

                {/* <div className="w-[320px] md:ml-[32px]">

                </div> */}
              </div>
            </div>
          </>
        )}
      </AuthCheck>
    </>
  );
}

export default BaseProfileEdit;
