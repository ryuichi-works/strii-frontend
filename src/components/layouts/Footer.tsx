type Props = {
  className?: string
}

const Footer: React.FC<Props> = ({className}) => {
  const siteStartYear = 2024;
  const date = new Date();

  const copyRightYear = `${siteStartYear}-${siteStartYear !== date.getFullYear() ? date.getFullYear() : ''}`;

  return (
    <>
      <footer className={`${className}`}>
        <div className="flex flex-col justify-center items-center gap-2 w-full h-[96px] text-white font-bold bg-sub-green md:h-[120px] md:gap-4">
          <p className="hover:cursor-default hover:underline">お問合せ・サイトフィードバック</p>
          <p className="hover:cursor-default hover:underline">利用規約</p>
        </div>

        <div className="flex justify-center items-center w-full h-[64px] bg-main-green md:h-[100px]">
          <p className="text-faint-green font-bold md:text-[18px] ">
            <span className="mr-[2px]">©️</span>
            <span>{copyRightYear}</span>
            <span>Strii</span>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
