import { NextPage } from "next";
import Link from "next/link";
import Cookies from "js-cookie";

import useSWR from 'swr';
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const UserLogin: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [shouldRemember, setShouldRemember] = useState(false)

  const [auth, setAuth] = useState<boolean>(false);

  // const router = useRouter();

  // type User = {
  //   id: string,
  //   name: string,
  //   email: string,
  //   email_verified_at: null | string,
  //   file_path: string,
  //   created_at: string,
  //   updated_at: string
  // }

  // const { data, error, mutate } = useSWR('/api/user', async (): Promise<User | null> =>
  //   await axios.get('/api/user')
  //     .then(res => res.data)
  //     .catch(error => {
  //       // if (error.response.status !== 409) throw error

  //       // router.push('/verify-email')
  //       router.push('/users/login');
  //     }),
  // )

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  // type loginProps = {
  //   setErrors: () => {},
  //   setStatus: () => {},
  //   props: {
  //     name: string,
  //     email: string,
  //     passowrd: string
  //   }
  // }
  //   const login = async ({ setErrors, setStatus, ...props }: loginProps) => {
  //     await csrf()

  //     setErrors([])
  //     setStatus(null)

  //     axios
  //       .post('/login', props)
  //       .then(() => mutate())
  //       .catch(error => {
  //         if (error.response.status !== 422) throw error

  //         setErrors(error.response.data.errors)
  //       })
  //   }
  // }

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('login');
    //ユーザーlogin apiを叩く
    // debugger
    const loginData = {
      email: email,
      password: password
    }
    await csrf();
    // await axios.post('/users/login', loginData)
    await axios.post('/users/login', loginData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    })
      .then((res) => {
        console.log(res);
        setAuth(true);
        // mutate();
        // router.push(`/users/${res.data.id}/profile`);
      })
      .catch(error => {
        // if (error.response.status !== 422) throw error

        // setErrors(error.response.data.errors)
        console.log('ログインに失敗しました。');
      })
    //成功してスタータス200が帰ってきたらユーザープロフィール画面に遷移
  }

  const logout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await csrf();
    await axios.post('/users/logout', {}, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      },
    })
      .then((res) => {
        console.log(res);
        setAuth(false);
      })
      .catch(error => {
        console.log('ログアウトに失敗しました。', error);
      })
  }

  return (
    <>
      <div className="container text-gray-600 px-2 sm:px-5 py-5 mx-auto">
        {!auth && (
          <>

            <div className="flex flex-col text-center w-full mb-5">
              <h1 className="text-xl sm:text-2xl font-medium title-font text-gray-900">ログイン</h1>
            </div>

            <form onSubmit={login} className="w-full md:w-4/5 lg:max-w-md mx-auto border rounded-md py-2">
              <div className="flex flex-col items-center">

                <div className="px-4 py-2 w-full sm:w-3/4 ">
                  <label htmlFor="email" className="leading-7 text-base text-gray-600">email</label>
                  <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                <div className="px-4 py-2 w-full sm:w-3/4 ">
                  <label htmlFor="password" className="leading-7 text-base text-gray-600">password</label>
                  <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                </div>
                {/* <div className="px-4 py-2 w-full sm:w-3/4 ">
              <label htmlFor="shouldRemember" className="leading-7 text-base text-gray-600">shouldRemember</label>
              <input type="checkbox" id="shouldRemember" name="shouldRemember" onChange={(e) => setShouldRemember(e.target.value)} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div> */}

                <div className="px-2 py-4 w-full">
                  <button type='submit' className="block mx-auto text-white w-3/4 sm:w-2/5 lg:w-2/5 bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-base">ログイン</button>
                </div>

              </div>
            </form>

          </>
        )}

        {auth && (
          <>
            <div className="flex flex-col text-center w-full mb-5">
              <h1 className="text-xl sm:text-2xl font-medium title-font text-gray-900">ログアウト</h1>
            </div>

            <form onSubmit={logout} className="w-full md:w-4/5 lg:max-w-md mx-auto border rounded-md py-2">
              <div className="px-2 py-4 w-full">
                <button type='submit' className="block mx-auto text-white w-3/4 sm:w-2/5 lg:w-2/5 bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-base">ログアウト</button>
              </div>
            </form>
          </>
        )}

      </div>
    </>
  );
}

export default UserLogin;
