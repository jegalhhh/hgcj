import * as S from "./Button.styles";

type Props = {
  title: string;
  onClick: () => void;
};

const SecondaryButton = ({ title, onClick }: Props) => {
  return (
    <S.SecondaryWrapper type="button" onClick={onClick}>
      <S.ButtonText>{title}</S.ButtonText>
    </S.SecondaryWrapper>
  );
};

export default SecondaryButton;
