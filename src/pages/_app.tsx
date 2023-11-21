import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvidor } from '@/context/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthContextProvidor>
        <Component {...pageProps} />
      </AuthContextProvidor>
    </>
  );
  // return <Component {...pageProps} />
}
