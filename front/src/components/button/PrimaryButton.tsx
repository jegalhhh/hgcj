import * as S from "./Button.styles";

type Props = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
};

const PrimaryButton = ({ title, onClick, disabled }: Props) => {
  return (
    <S.PrimaryWrapper type="button" onClick={onClick} disabled={disabled}>
      <S.ButtonText>{title}</S.ButtonText>
    </S.PrimaryWrapper>
  );
};

export default PrimaryButton;
