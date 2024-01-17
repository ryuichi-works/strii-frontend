import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className='text-[16px] tracking-wide'>
      <Head />
      <body className='overflow-hidden'>
        <div className='overflow-hidden min-h-screen relative'>
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  )
}
