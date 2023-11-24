import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className='text-[16px] tracking-wide overflow-auto'>
      <Head />
      <body>
        <div className='overflow-hidden'>
          <Main />
          <NextScript />
        </div>
      </body>
    </Html>
  )
}
