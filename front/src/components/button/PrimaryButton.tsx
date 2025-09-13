import * as S from "./Button.styles";

type Props = {
  title: string;
  onClick: () => void;
  className?: string;
};

const PrimaryButton = ({ title, onClick, className }: Props) => {
  return (
    <S.PrimaryWrapper type="button" onClick={onClick} className={className}>
      <S.ButtonText>{title}</S.ButtonText>
    </S.PrimaryWrapper>
  );
};

export default PrimaryButton;
