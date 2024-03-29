import { useEffect } from "react";

type SelectBoxProps = {
  labelText: string,
  type?: string,
  onChangeHandler?: any,
  optionValues: string[],
  value?: any
  setState?: any,
  className?: string,
}

const SelectBox: React.FC<SelectBoxProps> = ({
  labelText,
  type,
  onChangeHandler,
  optionValues,
  value,
  setState,
  className,
}) => {
  return (
    <>
      <label htmlFor={type} className="block text-[14px] h-[16px] mb-1 md:text-[16px] md:h-[18px] md:mb-2">{labelText}</label>

      <select
        name={type}
        id={type}
        value={value}
        onChange={(e) => onChangeHandler(e, setState ? setState : null)}
        className={` border border-gray-300 rounded ${className} p-2 focus:outline-sub-green`}
      >
        {optionValues.map(_value => (<option key={_value} value={_value}>{_value}</option>))}
      </select>
    </>
  );
}

export default SelectBox;
