import { Gut } from "@/pages/reviews";
import { Racket } from "@/pages/users/[id]/profile";

type SelectedToolWithoutImageProps = {
  tool?: Gut | Racket,
  type: 'gut' | 'racket',
  selectBtnVisible: boolean,
  btnText?: string,
  btnClickHandler?: any,
}

const SelectedToolWithoutImage: React.FC<SelectedToolWithoutImageProps> = ({
  tool,
  type,
  selectBtnVisible,
  btnText = 'ボタン',
  btnClickHandler,
}) => {
  return (
    <>
        <div className="flex justify-between gap-[24px] w-[100%] max-w-[320px] md:max-w-[216px]">
          <div>
            <p className="text-[14px] h-[16px] mb-[4px] leading-[16px] md:text-[16px] md:h-[18px]">選択中</p>

            <div className="w-[216px] border rounded py-[8px] bg-white">
              <p className="text-[14px] pb-1 h-[16px] pl-[16px] leading-[16px] md:text-[16px] md:h-[18px] md:mb-1">{tool ? tool.maker.name_en : ''}</p>
              <p className="text-[16px] text-center h-[18px] leading-[18px] md:text-[18px] md:h-[20px]">{tool ? tool.name_ja : '未選択'}</p>
            </div>
          </div>

          {selectBtnVisible && (
            <>
              <div className="flex justify-end mt-[20px]">
                <button type="button" onClick={btnClickHandler} className="text-white font-bold text-[14px] w-[80px] h-[32px] rounded ml-auto  bg-sub-green md:text-[16px]">{btnText}</button>
              </div>
            </>
          )}
        </div>
    </>
  );
}

export default SelectedToolWithoutImage;
