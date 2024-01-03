import { ReactNode, useState } from "react";

type DropDownMenuProps = {
  listClassName: string,
  dropDownTitle: string,
  dropDownAreaWidth?: string,
  children: ReactNode
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  listClassName,
  dropDownTitle,
  dropDownAreaWidth = 'w-[100px]',
  children
}) => {
  const [
    dropDownMenuVisibilityClassName,
    setDropDownMenuVisibilityClassName
  ] = useState<string>('hidden');


  const openDropDownMene = () => {
    setDropDownMenuVisibilityClassName('block');
  }

  const closeDropDownMene = () => {
    setDropDownMenuVisibilityClassName('hidden');
  }

  return (
    <>
      <li
        onMouseOver={openDropDownMene}
        onMouseOut={closeDropDownMene}
        className={`flex justify-center items-center relative cursor-pointer ${listClassName}`}
      >
        <div className="">{dropDownTitle}</div>
        <div className={`${dropDownMenuVisibilityClassName} absolute left-0 top-[100%] flex flex-col bg-main-green ${dropDownAreaWidth} text-center mx-auto overflow-x-auto`}>
          <ul>
            {children}
          </ul>
        </div>
      </li>
    </>
  );
}

export default DropDownMenu;
