import * as S from "./Button.styles";

type Props = {
  icon: string;
  onClick?: () => void;
  size?: number;
  alt?: string;
};

const IconButton = ({ icon, onClick, size, alt = "icon" }: Props) => {
  return (
    <div onClick={onClick}>
      <S.IconImage src={icon} size={size} alt={alt} />
    </div>
  );
};

export default IconButton;
