//　thumbColor　trackColorは使いたい色のリテラル型のユニオンで下記記法を参考に追加して使用元でリテラル型として指定して使う
export type ThumbColor = '[&::-webkit-slider-thumb]:bg-sub-green [&::-moz-range-thumb]:bg-sub-green'

export type TrackColor = 
  | '[&::-webkit-slider-runnable-track]:bg-gray-300 [&::-moz-range-track]:bg-gray-300'
  | '[&::-webkit-slider-runnable-track]:bg-white [&::-moz-range-track]:bg-white'

type InputRangeProps = {
  min: number,
  max: number,
  step: number,
  value: number,
  chengeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
  thumbColor?: ThumbColor,
  trackColor?: TrackColor
}

const InputRange: React.FC<InputRangeProps> = ({
  min,
  max,
  step,
  value,
  chengeHandler,
  thumbColor = ' [&::-webkit-slider-thumb]:bg-sub-green [&::-moz-range-thumb]:bg-sub-green ',
  trackColor = ' [&::-webkit-slider-runnable-track]:bg-gray-300 [&::-moz-range-track]:bg-gray-300 ',
}) => {
  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        // defaultValue={value}
        value={value}
        onChange={chengeHandler}
        className={`
          w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none
          [&::-webkit-slider-thumb]:w-[20px]
          [&::-webkit-slider-thumb]:h-[20px]
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_#628B5B]
          ${thumbColor}
          [&::-webkit-slider-thumb]:relative
          [&::-webkit-slider-thumb]:top-[-50%]

          [&::-moz-range-thumb]:w-[20px]
          [&::-moz-range-thumb]:h-[20px]
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:shadow-[0_0_0_1px_#628B5B]
          ${thumbColor}
          [&::-moz-range-thumb]:relative
          [&::-moz-range-thumb]:top-[-50%]

          [&::-webkit-slider-runnable-track]:w-full
          [&::-webkit-slider-runnable-track]:h-[10px]
          [&::-webkit-slider-runnable-track]:border-black
          [&::-webkit-slider-runnable-track]:rounded-full
          ${trackColor}

          [&::-moz-range-track]:w-full
          [&::-moz-range-track]:h-[10px]
          [&::-moz-range-track]:border-black
          [&::-moz-range-track]:rounded-full
          ${trackColor}
        `}
      />
    </>
  );
}

export default InputRange;
