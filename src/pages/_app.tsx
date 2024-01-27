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
        <div className="min-h-[calc(100vh-160px-64px-80px)] md:min-h-[calc(100vh-220px-64px-80px)]" >
          <Component {...pageProps} />
        </div>
        <Footer className='mt-[80px]' />
      </ContextProvidor>
    </>
  );
  // return <Component {...pageProps} />
}
