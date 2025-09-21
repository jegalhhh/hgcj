import * as S from "./Button.styles";

type Props = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

const PrimaryButton = ({ title, onClick, disabled, className }: Props) => {
  return (
    <S.PrimaryWrapper
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <S.ButtonText>{title}</S.ButtonText>
    </S.PrimaryWrapper>
  );
};

export default PrimaryButton;
