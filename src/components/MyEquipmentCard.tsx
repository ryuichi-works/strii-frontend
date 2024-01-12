import { MyEquipment } from "@/pages/reviews";

type MyEquipmentCardProps = {
  myEquipment: MyEquipment
  clickHandler?: () => {}
}

const MyEquipmentCard: React.FC<MyEquipmentCardProps> = ({
  myEquipment,
  clickHandler
}) => {
  const baseImagePath = process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/';

  return (
    <>
      <div
        onClick={clickHandler}
        className="max-w-[360px] w-[100%] min-h-[280px] bg-white border border-gray-400 rounded-lg flex flex-col justify-around py-4 hover:cursor-pointer"
      >
        {/* 単張りの時の表示 */}
        {myEquipment.stringing_way === "single" && (
          <>
            <div className=" flex justify-center mb-6">
              {/* gut情報 */}
              <div className="mr-8">
                <div className="w-[96px] flex flex-col justify-start items-start">
                  <div className="w-[96px] mb-1">
                    {myEquipment.main_gut.gut_image.file_path
                      && <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ストリング画像" className="w-[96px] h-[96px]" />
                    }
                  </div>

                  <div className="mb-2">
                    <p className="text-[14px] h-[16px] mb-2">{myEquipment.main_gut.maker.name_ja}</p>
                    <p className="tracking-tighter min-h-[16px] text-[14px]">{myEquipment.main_gut.name_ja}</p>
                  </div>

                  <div>
                    <p className="tracking-tighter h-[14px] text-[12px] mr-auto mb-2">{myEquipment.main_gut_guage.toFixed(2)} / {myEquipment.cross_gut_guage.toFixed(2)} mm</p>
                    <p className="tracking-tighter h-[14px] text-[12px] mr-auto">{myEquipment.main_gut_tension} / {myEquipment.cross_gut_tension} ポンド</p>
                  </div>
                </div>
              </div>

              {/* racket情報 */}
              <div className="flex flex-col items-center w-[96px]">
                <div className="w-[72px] flex flex-col items-center mb-1">
                  {myEquipment.racket.racket_image.file_path
                    ? <img src={`${baseImagePath}${myEquipment.racket.racket_image.file_path}`} alt="ラケット画像" className="w-[72px] h-[96px]" />
                    : <img src={`${baseImagePath}images/rackets/defalt_racket_image.png`} alt="ラケット画像" className="w-[72px] h-[96px]" />
                  }
                </div>

                <div className="text-center">
                  <p className="h-[16px] text-[14px] mb-4">{myEquipment.racket.maker.name_ja}</p>
                  <p className="tracking-tighter break-words min-h-[16px] text-[14px] max-w-[92px] ">{myEquipment.racket.name_ja}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ハイブリッド張りの時の表示 */}
        {myEquipment.stringing_way === "hybrid" && (
          <>
            <div className=" flex justify-center gap-x-[20px] mb-6">
              <div className="">
                <div className="w-[96px] flex flex-col justify-start items-start ">
                  <div className="w-[96px] mb-1">
                    {myEquipment.main_gut.gut_image.file_path
                      && <img src={`${baseImagePath}${myEquipment.main_gut.gut_image.file_path}`} alt="ストリング画像" className="w-[96px] h-[96px]" />
                    }
                  </div>

                  <div className="mb-2">
                    <p className="text-[14px] h-[16px] mb-2">{myEquipment.main_gut.maker.name_ja}</p>
                    <p className="tracking-tighter min-h-[16px] text-[14px] ">{myEquipment.main_gut.name_ja}</p>
                  </div>

                  <div>
                    <p className="tracking-tighter h-[14px] text-[12px] mr-auto mb-2">{myEquipment.main_gut_guage.toFixed(2)} mm</p>
                    <p className="tracking-tighter h-[14px] text-[12px] mr-auto">{myEquipment.main_gut_tension} ポンド</p>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="w-[96px] flex flex-col justify-start items-start">
                  <div className="w-[96px] mb-1">
                    {myEquipment.cross_gut.gut_image.file_path
                      && <img src={`${baseImagePath}${myEquipment.cross_gut.gut_image.file_path}`} alt="ストリング画像" className="w-[96px] h-[96px]" />
                    }
                  </div>

                  <div className="mb-2">
                    <p className="h-[16px] text-[14px] mb-2">{myEquipment.cross_gut.maker.name_ja}</p>
                    <p className="tracking-tighter min-h-[16px] text-[14px] ">{myEquipment.cross_gut.name_ja}</p>
                  </div>

                  <div>
                    <p className="tracking-tighter h-[14px] text-[12px] mr-auto mb-2">{myEquipment.cross_gut_guage.toFixed(2)} mm</p>
                    <p className="tracking-tighter h-[14px] text-[12px] mr-auto">{myEquipment.cross_gut_tension} ポンド</p>
                  </div>
                </div>
              </div>

              {/* racket情報 */}
              <div className="flex flex-col items-center w-[96px]">
                <div className="w-[72px] flex flex-col items-center mb-1">
                  {myEquipment.racket.racket_image.file_path
                    ? <img src={`${baseImagePath}${myEquipment.racket.racket_image.file_path}`} alt="ラケット画像" className="w-[72px] h-[96px]" />
                    : <img src={`${baseImagePath}images/rackets/defalt_racket_image.png`} alt="ラケット画像" className="w-[72px] h-[96px]" />
                  }
                </div>

                <div className="text-center">
                  <p className="h-[16px] text-[14px] mb-4">{myEquipment.racket.maker.name_ja}</p>
                  <p className="tracking-tighter break-words min-h-[16px] text-[14px] max-w-[92px] ">{myEquipment.racket.name_ja}</p>
                </div>
              </div>
            </div>
          </>
        )}

        <hr className="w-[328px] border-sub-green mb-2 mx-auto" />

        <div className="flex flex-col items-end mr-[24px]">
          <span className="inline-block h-[16px] text-[14px] mb-2">張った日：{myEquipment.new_gut_date}</span>
          <span className="inline-block h-[16px] text-[14px] ">張り替え・ストリングが切れた日：{myEquipment.change_gut_date}</span>
        </div>
      </div>
    </>
  );
}

export default MyEquipmentCard;
