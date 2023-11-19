import { NextPage } from "next";
import Link from "next/link";

const UserLogin: NextPage = () => {

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('login');
    //ユーザーlogin apiを叩く
    //成功してスタータス200が帰ってきたらユーザープロフィール画面に遷移
  }

  return (
    <>
      <div className="container text-gray-600 px-2 sm:px-5 py-5 mx-auto">
        <div className="flex flex-col text-center w-full mb-5">
          <h1 className="text-xl sm:text-2xl font-medium title-font text-gray-900">ログイン</h1>
        </div>

        <form onSubmit={login} className="w-full md:w-4/5 lg:max-w-md mx-auto border rounded-md py-2">
          <div className="flex flex-col items-center">

            <div className="px-4 py-2 w-full sm:w-3/4 ">
              <label htmlFor="email" className="leading-7 text-base text-gray-600">email</label>
              <input type="email" id="email" name="email" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div className="px-4 py-2 w-full sm:w-3/4 ">
              <label htmlFor="password" className="leading-7 text-base text-gray-600">password</label>
              <input type="password" id="password" name="password" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
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

export default UserLogin;
