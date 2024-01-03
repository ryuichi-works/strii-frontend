import Link from "next/link";

type HeaderNavLinkProps = {
  linkText: string
  className?: string,
  href: string
}

const HeaderNavLink: React.FC<HeaderNavLinkProps> = ({
  linkText,
  className,
  href
}) => {
  return (
    <>
      <li className={`flex justify-center items-center ${className} hover:opacity-80`}>
        <Link href={href}>{linkText}</Link>
      </li>
    </>
  );
}

export default HeaderNavLink;
