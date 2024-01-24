type FlashMessageProps = {
  flashMessage: string,
  flashType: 'success' | 'alert'
  className?: string,
}

const FlashMessage: React.FC<FlashMessageProps> = ({ flashMessage, flashType, className }) => {
  let flashTypeStyle: string = '';

  if(flashType === 'success') {
    flashTypeStyle = 'border-sub-green bg-faint-green'
  } else if(flashType === 'alert') {
    flashTypeStyle = 'border-red-500 bg-red-100'
  }

  return (
    <>
      <div className={`flex justify-center items-center w-[90%] h-[48px] border ${flashTypeStyle} rounded-lg ${className}`}>
        <p className="text-[14px] text-center md:text-[16px]">{flashMessage}</p>
      </div>
    </>
  );
}

export default FlashMessage;
