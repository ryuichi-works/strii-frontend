type SubHeadingProps = {
  text: string,
  className?: string
}

const SubHeading: React.FC<SubHeadingProps> = ({ text, className }) => {
  
  return (
    <h2 className={`${className}`}>{text}</h2>
  );
}

export default SubHeading;
