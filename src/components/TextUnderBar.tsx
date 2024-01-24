type TextUnderBarProps = {
  barColor?: string,
  className?: string
}

const TextUnderBar: React.FC<TextUnderBarProps> = ({
  barColor = 'border-sub-green',
  className
}) => {

  return (
    <hr className={`${barColor} ${className}`} />
  );
}

export default TextUnderBar;
