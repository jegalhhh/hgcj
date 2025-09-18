import * as S from "./Button.styles";

type Props = {
  title: string;
  onClick: () => void;
  className?: string;
};

const SecondaryButton = ({ title, onClick, className }: Props) => {
  return (
    <S.SecondaryWrapper type="button" onClick={onClick} className={className}>
      <S.ButtonText>{title}</S.ButtonText>
    </S.SecondaryWrapper>
  );
};

export default SecondaryButton;
