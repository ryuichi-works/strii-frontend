import type { Admin } from "@/context/AuthContext";
import type { NextPage } from "next";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

const UserLogin: NextPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('')

  const [password, setPassword] = useState<string>('')

  type Errors = {
    email: string[],
    password: string[]
  }

  const [errors, setErrors] = useState<Errors>({ email: [], password: [] });

  const { setIsAuthAdmin, setAdmin } = useContext(AuthContext);

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password
    }

    await csrf();

    await axios.post('/admins/login', loginData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(async (res) => {
      await axios.get('/api/admin').then(res => {

        const admin: Admin = res.data;
        console.log(admin);

        setAdmin(admin);

        setIsAuthAdmin(true);

        router.push(`/admins/${admin.id}/dashboard`);
      })
    }).catch((e) => {
      const newErrors = { email: [], password: [], ...e.response.data.errors };
      setErrors(newErrors);

      console.log('管理者ログインに失敗しました。');
    })
  }

  return (
    <>
      <div className="container text-gray-600 px-2 sm:px-5 py-5 mx-auto">

        <div className="flex flex-col text-center w-full mb-5">
          <h1 className="text-xl sm:text-2xl font-medium title-font text-gray-900">管理者用ログイン</h1>
        </div>

        <form onSubmit={login} className="w-full md:w-4/5 lg:max-w-md mx-auto border rounded-md py-2">
          <div className="flex flex-col items-center">

            <div className="px-4 py-2 w-full sm:w-3/4 ">
              <label htmlFor="email" className="leading-7 text-base text-gray-600">email</label>
              <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              {errors.email.length !== 0 &&
                errors.email.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
              }
            </div>

            <div className="px-4 py-2 w-full sm:w-3/4 ">
              <label htmlFor="password" className="leading-7 text-base text-gray-600">password</label>
              <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              {errors.password.length !== 0 &&
                errors.password.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
              }
            </div>

            <div className="px-2 py-4 w-full">
              <button type='submit' className="block mx-auto text-white w-3/4 sm:w-2/5 lg:w-2/5 bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-base">ログイン</button>
            </div>

          </div>
        </form>

      </div>
    </>
  );
}

export default UserLogin;
