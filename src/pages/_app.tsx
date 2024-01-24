import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '@/components/layouts/header';
import ContextProvidor from '@/components/ContextProvidor';
import Footer from '@/components/layouts/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ContextProvidor>
        <Header />
        <Component {...pageProps} />
        <Footer className='mt-[80px]' />
      </ContextProvidor>
    </>
  );
  // return <Component {...pageProps} />
}
