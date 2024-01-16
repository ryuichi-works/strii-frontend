// dbに登録している画像pathはimages/~で始まっており、
// 実際に参照したいpathは「https:~strage/images~」で参照したいため
export const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/'
