import Link from "next/link";

type LinkBtnProps = {
  href: string,
  linkText: string,
  bgColor?: string,
  btnClassName?: string,
  linkClassName?: string,
}

const LinkBtn: React.FC<LinkBtnProps> = ({
  href,
  linkText,
  btnClassName,
  linkClassName,
  bgColor = 'bg-sub-green',
}) => {
  return (
    <button className={`${bgColor ? bgColor : 'bg-sub-green'} ${btnClassName}`}>
      <Link
        href={href}
        className={`inline-block w-full h-full ${linkClassName}`}
      >
        {linkText}
      </Link>
    </button>
  );
}

export default LinkBtn;
