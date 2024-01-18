import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '@/components/layouts/header';
import ContextProvidor from '@/components/ContextProvidor';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ContextProvidor>
        <Header />
        <Component {...pageProps} />
      </ContextProvidor>
    </>
  );
  // return <Component {...pageProps} />
}
