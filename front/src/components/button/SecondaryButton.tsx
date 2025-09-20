import * as S from "./Button.styles";

type Props = {
  title: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};

const SecondaryButton = ({ title, onClick, className, disabled }: Props) => {
  return (
    <S.SecondaryWrapper type="button" onClick={onClick} className={className} disabled={disabled}>
      <S.ButtonText>{title}</S.ButtonText>
    </S.SecondaryWrapper>
  );
};

export default SecondaryButton;
