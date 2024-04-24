import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link';
import Head from 'next/head'
import SubHeading from '@/components/SubHeading';
import TextUnderBar from '@/components/TextUnderBar';
import HeroPcSize from '../../public/hero_pc_size.png';
import HeroSpSize from '../../public/hero_sp_size.png';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>strii(ストリー) - テニスのストリング・ガット、レビューサイト</title>
      </Head>
      <div className="mx-auto">
        {/* hero section */}
        <section className='container mx-auto h-[480px] sm:h-[358px] md:h-[430px] xl:h-[571px]'>
          <div className='relative mx-auto sm:static sm:flex lg:w-[1024px] xl:w-[1280px]'>
            <div className='absolute top-[98px] flex flex-col items-center gap-[8px] flex-wrap w-full h-[290px] bg-black bg-opacity-60 sm:static sm:h-[358px] md:h-[430px] xl:h-[571px] lg:w-[62.5%] xl:w-[60%]'>
              <p className='text-white font-hero-sub text-[24px] md:text-[28px] lg:text-[32px] xl:text-[40px] w-full max-w-[290px] sm:max-w-[260px] md:max-w-[312px] lg:max-w-[518px] xl:max-w-[648px] sm:mb-8  min-h-[144px] mt-6 md:mt-[48px] xl:mt-[72px] md:mb-[48px] xl:mb-[56px] '>
                自分に合った<br className='lg:hidden' />
                ストリング・ガット<br />
                を見つけるための<br className='hidden sm:block md:hidden' />サイト<br />
                そうそれが<br />
              </p>

              <p className='w-full max-w-[326px] sm:max-w-[260px] md:max-w-[312px] lg:max-w-[518px] text-right text-white text-[28px] sm:text-[32px] md:text-[36px] lg:text-[45px] font-bold italic'>Strii(ストリー)</p>
            </div>

            <div className='w-full h-[480px] absolute top-0 left-0 -z-10 sm:static sm:h-auto lg:w-auto'>
              <div className='flex justify-center  relative'>
                <Image
                  src={HeroPcSize}
                  alt="Vercel Logo"
                  className="hidden sm:block sm:w-[320px] md:w-[384px] xl:w-[512px]"
                />

                <Image
                  src={HeroSpSize}
                  alt="Vercel Logo"
                  className="sm:hidden"
                />
              </div>
            </div>
          </div>
        </section>

        <div className='flex justify-center items-center h-[88px] text-[18px] md:text-[24px] md:h-[184px]'>
          <p>このサイトでできること</p>
        </div>

        {/* section 1 */}
        <section className='flex flex-col items-center bg-faint-green py-[40px] md:py-[80px]'>
          <div className='w-full max-w-[320px] md:max-w-[768px]'>
            <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[768px] md:mx-auto md:flex md:flex-col md:items-center md:mb-[72px]">
              <SubHeading text='１、ストリング・ガットのレビュー投稿・閲覧' className="text-[18px] md:text-[24px] md:text-center" />
              <TextUnderBar className="block w-[100%] max-w-[320px] md:max-w-[528px]" />
            </div>

            <div className='flex flex-col items-center mb-[40px] md:mb-[64px]'>
              <p className='font-top-yumincho text-[18px] font-[500] mb-4 w-[272px] md:w-[768px] md:text-center md:text-[22px]'>
                レビューを見て自分に合った<br className='md:hidden' />
                ストリング・ガットを探そう!!
              </p>

              <div className='w-full max-w-[320px] bg-white rounded-2xl border border-gray-300 shadow-[0_2px_2px_rgba(0,0,0,0.3)] md:max-w-[768px] md:text-[18px]'>
                <p className='text-4 p-4'>
                  テニス歴や年齢の近い人、<br className='md:hidden' />
                  好きなショット、<br className='md:hidden' />
                  苦手なショットなど、<br className='md:hidden' />
                  自分とテニスの実力が近い人のレビューを検索することができます。
                </p>
              </div>
            </div>

            <div className='flex flex-col items-center'>
              <p className='font-top-yumincho text-[18px] font-[500] mb-4 w-[272px] md:w-[768px] md:text-center md:text-[22px]'>
                レビューを投稿して<br className='md:hidden' />
                他の仲間のストリング・ガット<br className='md:hidden' />
                探しに貢献しよう！！
              </p>

              <div className='w-full max-w-[320px] bg-white rounded-2xl border border-gray-300 shadow-[0_2px_2px_rgba(0,0,0,0.3)]  md:max-w-[768px] md:text-[18px]'>
                <p className='text-4 p-4'>
                  ストリング選びに悩んでいる他の仲間の助けになります
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* section 2 */}
        <section className='flex flex-col items-center py-[40px] md:py-[80px]'>
          <div className='w-full max-w-[320px] md:max-w-[768px]'>
            <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[768px] md:flex md:flex-col md:items-center md:mb-[72px]">
              <SubHeading text='3、装備構成を履歴として記録' className="text-[18px] md:text-[24px] md:text-center" />
              <TextUnderBar className="block w-[100%] max-w-[320px] md:max-w-[340px]" />
            </div>

            <div className='flex flex-col items-center'>
              <p className='font-top-yumincho text-[18px] font-[500] mb-4 w-[272px] md:w-[768px] md:text-center md:text-[22px]'>
                過去の装備と比べて、より良いセッティングを探そう！！！
              </p>

              <div className='w-full max-w-[320px] bg-white rounded-2xl border border-gray-300 shadow-[0_2px_2px_rgba(0,0,0,0.3)] md:max-w-[768px] md:text-[18px]'>
                <p className='text-4 p-4'>
                  ストリング・ガットの太さ、<br className='md:hidden' />テンション、張った日など
                  詳細に記録し、後で見比べることができます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* section 3 */}
        <section className='flex flex-col items-center bg-faint-green py-[40px] md:py-[80px]'>
          <div className='w-full max-w-[320px] md:max-w-[768px]'>
            <div className="w-[100%] max-w-[320px] mb-6 md:max-w-[768px] md:flex md:flex-col md:items-center md:mb-[64px]">
              <SubHeading text='３、どんなストリング・ガットの種類があるのかを知る' className="text-[18px]  md:text-[24px] md:text-center" />
              <TextUnderBar className="block w-[100%] max-w-[320px] md:max-w-[602px]" />
            </div>

            <div className='flex flex-col items-center mb-[40px]'>
              <p className='font-top-yumincho text-[18px] font-[500] mb-4 w-[272px] md:w-[768px] md:text-center md:text-[22px]'>
                ストリング・ガット選びの参考にしよう！！！
              </p>
              <div className='w-full max-w-[320px] bg-white rounded-2xl border border-gray-300 shadow-[0_2px_2px_rgba(0,0,0,0.3)]  md:max-w-[768px] md:text-[18px]'>
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
