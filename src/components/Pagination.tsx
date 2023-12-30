import type { GutImage } from "@/pages/guts/register";
import type { Gut } from "@/pages/reviews";
import type { Racket, RacketImage } from "@/pages/users/[id]/profile";
import React from "react";

type PaginationLinkData = {
  url: string | null,
  label: string,
  active: boolean
}

export type Paginator<T> = {
  current_page: number,
  data: T[],
  first_page_url: string,
  from: number,
  last_page: number,
  last_page_url: string,
  links: PaginationLinkData[],
  next_page_url: string,
  path: string,
  per_page: number,
  prev_page_url: string | null,
  to: number,
  total: number
}

type PaginationProps = {
  // ページネーションさせたい項目分だけpaginatorの型を増やして使う
  paginator?: Paginator<Gut> | Paginator<Racket> | Paginator<GutImage> | Paginator<RacketImage>,
  //ページネイトリンクをクリックした時にデータをfetchするための関数が渡ってくる
  paginate: (url?: string) => Promise<void>,
  className?: string
}

// laravelのpagenateメソッドを使うことを前提として作成している
const Pagination: React.FC<PaginationProps> = ({ paginator, paginate, className }) => {
  const paginateHandler = (url?: string) => {
    if (url) {
      paginate(url);
    }
  }

  //fullUrlをaxiosでbaseUrlを設定しているときなどに必要な部分のみ返すため
  const removeBaseUrl = (fullUrl?: string): string | undefined => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    if (fullUrl && baseUrl) {
      return fullUrl.replace(baseUrl, "");
    }

    return undefined
  }

  return (
    <>
      <div className={`w-[100%] max-w-[320px] mx-auto md:max-w-[768px] ${className}`}>
        <ul className="flex flex-wrap justify-center w-[100%] max-w-[320px] mx-auto md:max-w-[768px] md:flex-nowrap">
          <div className="order-2 flex w-[100%] max-w-[96px] h-[24px] md:order-1 md:h-[32px]">
            <li className="inline-block w-[48px] text-center grow-1 border rounded-l-sm md:rounded-l">
              <a
                onClick={() => paginateHandler(removeBaseUrl(paginator?.first_page_url))}
                className="inline-block cursor-pointer w-[100%] max-w-[48px] md:leading-[32px]"
                aria-disabled={paginator?.current_page === 1}
              >
                最初
              </a>
            </li>

            <li className="inline-block w-[48px] text-center border-y border-r">
              <a
                onClick={() => {
                  if (paginator?.prev_page_url) {
                    const url = removeBaseUrl(paginator?.prev_page_url);
                    paginateHandler(url)
                  }
                }}
                className={`inline-block cursor-pointer w-[100%] max-w-[48px] ${paginator?.prev_page_url ?? 'opacity-30 !cursor-default'} md:leading-[32px]`}
                aria-disabled={!(paginator?.prev_page_url)}
              >
                前へ
              </a>
            </li>
          </div>

          <div className="flex justify-center order-1 w-[100%] max-w-[320px] mb-[8px] md:order-2 md:w-auto md:max-w-none md:mb-0">
            {paginator?.links.map((link, index) => {
              //前へと次へは表示の関係上、別でリンクを用意する
              if (index === 0 || index === paginator.links.length - 1) return;

              return (
                <>
                  <li className="inline-block w-[24px] h-[24px] text-center border-y border-l  [&:last-child]:border-r [&:first-child]:rounded-l-sm [&:last-child]:rounded-r-sm md:w-[32px] md:h-[32px] md:[&:first-child]:rounded-l-none md:[&:last-child]:rounded-r-none md:[&:first-child]:border-l-0 md:[&:last-child]:border-r-0">
                    <a
                      type="button"
                      onClick={() => paginateHandler(removeBaseUrl(link.url ? link.url : undefined))}
                      className={`cursor-pointer w-[100%] h-[100%] text-center ${link.active && 'text-sub-green bg-faint-green'} md:leading-[32px]`}
                      aria-disabled={link.active}
                    >
                      {link.label}
                    </a>
                  </li>
                </>
              )
            })}
          </div>

          <div className="order-4 flex md:order-3 h-[24px] md:h-[32px]">
            <li className="inline-block w-[48px] text-center border h-[24px] md:h-[32px]">
              <a
                onClick={() => paginateHandler(removeBaseUrl(paginator?.next_page_url))}
                className={`inline-block cursor-pointer w-[100%] max-w-[48px] h-[100%] ${paginator?.next_page_url ?? 'opacity-30 !cursor-default'} md:leading-[32px]`}
                aria-disabled={!(paginator?.next_page_url)}
              >
                次へ
              </a>
            </li>

            <li className="inline-block w-[48px] text-center border-y border-r rounded-r-sm md:h-[32px] md:rounded-r">
              <a
                onClick={() => paginateHandler(removeBaseUrl(paginator?.last_page_url))}
                className="inline-block cursor-pointer w-[100%] max-w-[48px] h-[100%] md:leading-[32px]"
                aria-disabled={paginator?.current_page === paginator?.last_page}
              >
                最後
              </a>
            </li>
          </div>

          <span className="order-3 w-[100%] max-w-[120px] h-[24px] text-center border-y md:order-4 md:hidden">
            {paginator?.current_page} / {paginator?.last_page}
          </span>

        </ul>
      </div>
    </>
  );
}

export default Pagination;
