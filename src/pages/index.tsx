import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link';
import SubHeading from '@/components/SubHeading';
import TextUnderBar from '@/components/TextUnderBar';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div className="container mx-auto">
        {/* hero section */}
        <section className='min-h-[480px]'>
          <div className='relative'>
            <div className='absolute top-[98px] flex flex-col items-center gap-[8px] flex-wrap w-full h-[290px] bg-black bg-opacity-50'>
              <p className='text-white font-hero-sub text-[24px] w-full max-w-[290px] h-[144px] min-h-[144px]] mt-6'>
                自分に合った<br />
                ストリング・ガット<br />
                を見つけるためのサイト<br />
                そうそれが<br />
              </p>
              <p className='w-full max-w-[326px] text-right text-white text-[28px] font-bold italic'>Strii(ストリー)</p>
            </div>
            <div className='w-full h-[480px] bg-green-200 absolute top-0 left-0 -z-10'>

            </div>
          </div>
        </section>

        <div className='flex justify-center items-center h-[88px] text-[18px]'>
          <p>このサイトでできること</p>
        </div>

        {/* section 1 */}
        <section className='flex flex-col items-center bg-faint-green py-[40px]'>
          <div className='w-full max-w-[320px]'>
            <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[360px] ">
              <SubHeading text='１、ストリング・ガットのレビュー  　　　　　　　　　　　投稿・閲覧' className="text-[18px] md:text-[18px] md:mb-2" />
              <TextUnderBar className="block w-[100%] max-w-[320px] md:max-w-[360px]" />
            </div>

            <div className='flex flex-col items-center mb-[40px]'>
              <p className='font-top-yumincho text-[18px] font-[500] mb-4 w-[272px]'>
                レビューを見て自分に合った<br className='md:hidden' />
                ストリング・ガットを探そう!!
              </p>
              <div className='w-full max-w-[320px] bg-white rounded-2xl border border-gray-300 shadow-[0_2px_2px_rgba(0,0,0,0.3)]'>
                <p className='text-4 p-4'>
                  テニス歴や年齢の近い人、<br />
                  好きなショット、<br />
                  苦手なショットなど、<br />
                  自分とテニスの実力が近い人のレビューを検索することができます。
                </p>
              </div>
            </div>

            <div className='flex flex-col items-center'>
              <p className='font-top-yumincho text-[18px] font-[500] mb-4 w-[272px]'>
                レビューを投稿して<br />
                他の仲間のストリング・ガット<br />
                探しに貢献しよう！！
              </p>
              <div className='w-full max-w-[320px] bg-white rounded-2xl border border-gray-300 shadow-[0_2px_2px_rgba(0,0,0,0.3)]'>
                <p className='text-4 p-4'>
                  ストリング選びに悩んでいる他の仲間の助けになります
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* section 2 */}
        <section className='flex flex-col items-center py-[40px]'>
          <div className='w-full max-w-[320px]'>
            <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[360px] ">
              <SubHeading text='3、装備構成を履歴として記録' className="text-[18px] md:text-[18px] md:mb-2" />
              <TextUnderBar className="block w-[100%] max-w-[320px] md:max-w-[360px]" />
            </div>

            <div className='flex flex-col items-center'>
              <p className='font-top-yumincho text-[18px] font-[500] mb-4 w-[272px]'>
                過去の装備と比べて、より良いセッティングを探そう！！！
              </p>
              <div className='w-full max-w-[320px] bg-white rounded-2xl border border-gray-300 shadow-[0_2px_2px_rgba(0,0,0,0.3)]'>
                <p className='text-4 p-4'>
                  ストリング・ガットの太さ、<br />テンション、張った日など
                  詳細に記録し、後で見比べることができます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* section 3 */}
        <section className='flex flex-col items-center bg-faint-green py-[40px]'>
          <div className='w-full max-w-[320px]'>
            <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[360px] ">
              <SubHeading text='３、どんなストリング・ガットの 　　　　　種類があるのかを知る' className="text-[18px] md:text-[18px] md:mb-2" />
              <TextUnderBar className="block w-[100%] max-w-[320px] md:max-w-[360px]" />
            </div>

            <div className='flex flex-col items-center mb-[40px]'>
              <p className='font-top-yumincho text-[18px] font-[500] mb-4 w-[272px]'>
                ストリング・ガット選びの参考にしよう！！！
              </p>
              <div className='w-full max-w-[320px] bg-white rounded-2xl border border-gray-300 shadow-[0_2px_2px_rgba(0,0,0,0.3)]'>
                <p className='text-4 p-4'>
                  各メーカーが出しているストリング・ガットの情報を確認することができます
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  )
}
