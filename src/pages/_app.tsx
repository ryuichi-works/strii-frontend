import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvidor } from '@/context/AuthContext'
import Header from '@/components/layouts/header';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthContextProvidor>
          <Header/>
          <Component {...pageProps} />
      </AuthContextProvidor>
    </>
  );
  // return <Component {...pageProps} />
}
