import * as S from "./Button.styles";

type Props = {
  title: string;
  isSelected: boolean;
  onClick: () => void;
};

const SelectButton = ({ title, isSelected, onClick }: Props) => {
  return (
    <S.SelectWrapper type="button" isSelected={isSelected} onClick={onClick}>
      <S.SelectText isSelected={isSelected}>{title}</S.SelectText>
    </S.SelectWrapper>
  );
};

export default SelectButton;
