type PrimaryHeadingProps = {
  text: string,
  className?: string 
}

const PrimaryHeading: React.FC<PrimaryHeadingProps> = ({ text, className }) => {
  return (
    <h1 className={`${className}`}>{text}</h1>
  );
}

export default PrimaryHeading;
