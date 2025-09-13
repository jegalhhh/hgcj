import * as S from "./Button.styles";

type Props = {
  title: string;
  onClick: () => void;
};

const PrimaryButton = ({ title, onClick }: Props) => {
  return (
    <S.PrimaryWrapper type="button" onClick={onClick}>
      <S.ButtonText>{title}</S.ButtonText>
    </S.PrimaryWrapper>
  );
};

export default PrimaryButton;
