import type { NextPage } from "next";
import type { User } from "@/context/AuthContext";
import axios from "@/lib/axios";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

const UserRegister: NextPage = () => {
  const router = useRouter();

  const [name, setName] = useState<string>('')

  const [email, setEmail] = useState<string>('')

  const [password, setPassword] = useState<string>('')

  const [passwordConfirmation, setpasswordConfirmation] = useState<string>('')

  type Errors = {
    name: string[],
    email: string[],
    password: string[],
    password_confirmation: string[]
  }

  const initialErrorVals = { name: [], email: [], password: [], password_confirmation: [] }

  const [errors, setErrors] = useState<Errors>(initialErrorVals);

  const { setIsAuth, setUser } = useContext(AuthContext);

  const csrf = async () => await axios.get('/sanctum/csrf-cookie');

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const registerData = {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation
    }

    await csrf();

    await axios.post('/users/register', registerData, {
      headers: {
        'X-Xsrf-Token': Cookies.get('XSRF-TOKEN'),
      }
    }).then(async (res) => {
      await axios.get('/api/user').then(res => {

        const user: User = res.data;

        setUser(user);

        setIsAuth(true);

        router.push(`/users/${user.id}/profile`);
      })
    }).catch((e) => {
      const newErrors = { ...initialErrorVals, ...e.response.data.errors };

      setErrors(newErrors);

      console.log('ユーザー登録に失敗しました。');
    })
  }

  return (
    <>
      <div className="container text-gray-600 px-2 sm:px-5 py-5 mx-auto">

        <div className="flex flex-col text-center w-full mb-5">
          <h1 className="text-xl sm:text-2xl font-medium title-font text-gray-900">ユーザー登録</h1>
        </div>

        <form onSubmit={signUp} className="w-full md:w-4/5 lg:max-w-md mx-auto border rounded-md py-2">
          <div className="flex flex-col items-center">

            <div className="px-4 py-2 w-full sm:w-3/4 ">
              <label htmlFor="name" className="leading-7 text-base text-gray-600">name</label>
              <input type="name" id="name" name="name" onChange={(e) => setName(e.target.value)} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              {errors.name.length !== 0 &&
                errors.name.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
              }
            </div>

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

            <div className="px-4 py-2 w-full sm:w-3/4 ">
              <label htmlFor="password_confirmation" className="leading-7 text-base text-gray-600">password_confirmation</label>
              <input type="password" id="password_confirmation" name="password_confirmation" onChange={(e) => setpasswordConfirmation(e.target.value)} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              {errors.password_confirmation.length !== 0 &&
                errors.password_confirmation.map((message, i) => <p key={i} className="text-red-400">{message}</p>)
              }
            </div>

            <div className="px-2 py-4 w-full">
              <button type='submit' className="block mx-auto text-white w-3/4 sm:w-2/5 lg:w-2/5 bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-base">登録</button>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}

export default UserRegister;
