import { Html, Head, Main, NextScript } from 'next/document'
import Favicon from '@/components/Favicon'

export default function Document() {
  return (
    <Html lang="en" className='text-[16px] tracking-wide'>
      <Head>
        <Favicon />
        <meta name="keywords" content="テニス,テニスガット,テニスストリング,テニス　ガット　おすすめ,テニス　ストリング　おすすめ,ガット　レビュー,ストリング　レビュー" />
        <meta name="description" content="strii(ストリー)はテニスのストリング・ガット情報に特化したレビューサイトです。上達のために自分に本当に合うストリング・ガット、セッティングを見つけましょう。"/>
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
