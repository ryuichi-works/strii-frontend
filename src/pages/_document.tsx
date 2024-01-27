import { Html, Head, Main, NextScript } from 'next/document'
import Favicon from '@/components/Favicon'

export default function Document() {
  return (
    <Html lang="en" className='text-[16px] tracking-wide'>
      <Head>
        <Favicon />
      </Head>

      <body className='overflow-x-hidden'>
        <div className='overflow-hidden min-h-screen relative'>
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  )
}
