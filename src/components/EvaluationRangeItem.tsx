import InputRange from "./inputRange";

type EvaluationRangeItemProps = {
  labelText: string,
  scale: boolean,
  onChangeInputRangeHnadler: (e: React.ChangeEvent<HTMLInputElement>) => void
  valueState?: number | null,
  className?: string
}

const EvaluationRangeItem: React.FC<EvaluationRangeItemProps> = ({
  labelText,
  scale = false,
  onChangeInputRangeHnadler,
  valueState,
  className
}) => {
  return (
    <>
      <div className={`flex flex-col ${className}`}>
        <p className="flex justify-between mb-[8px]">
          <label className="text-[14px] md:text-[16px]">{labelText}</label>
          {valueState && <span className="text-[14px] mr-2 italic md:text-[16px]">{valueState.toFixed(1)}</span>}
        </p>

        <InputRange
          min={1}
          max={5}
          step={0.5}
          value={3}
          chengeHandler={onChangeInputRangeHnadler}
        />

        {scale && (
          <>
            {/* メモリ */}
            <div className="flex justify-between mt-2">
              <span className="inline-block text-[14px] text-center italic w-[20px] h-[16px] leading-[16px]">1</span>
              <span className="inline-block text-[14px] text-center italic w-[20px] h-[16px] leading-[16px]">2</span>
              <span className="inline-block text-[14px] text-center italic w-[20px] h-[16px] leading-[16px]">3</span>
              <span className="inline-block text-[14px] text-center italic w-[20px] h-[16px] leading-[16px]">4</span>
              <span className="inline-block text-[14px] text-center italic w-[20px] h-[16px] leading-[16px]">5</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default EvaluationRangeItem;