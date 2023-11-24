import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className='text-[16px] tracking-wide overflow-auto'>
      <Head />
      <body className='overflow-hidden h-screen'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
