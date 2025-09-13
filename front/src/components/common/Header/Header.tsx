import * as S from "./Header.styles";
import headerLogo from "../../assets/images/header_logo.png";
import backBtn from "../../assets/images/icon/left.png";

type HeaderProps =
  | { variant: "logo" }
  | { variant: "title"; title: string }
  | {
      variant: "backWithTitle";
      title: string;
      onBack: () => void;
    }
  | {
      variant: "backWithLogo";
      onBack: () => void;
    };

const Header = (props: HeaderProps) => {
  if (props.variant === "logo") {
    return (
      <S.HeaderWrapper>
        <S.Logo src={headerLogo} alt="로고" />
      </S.HeaderWrapper>
    );
  }

  if (props.variant === "title") {
    return (
      <S.HeaderWrapper>
        <S.Title>{props.title}</S.Title>
      </S.HeaderWrapper>
    );
  }

  if (props.variant === "backWithTitle") {
    return (
      <S.HeaderWrapper>
        <S.BackButton src={backBtn} alt="뒤로가기" onClick={props.onBack} />
        <S.Title>{props.title}</S.Title>
      </S.HeaderWrapper>
    );
  }

  if (props.variant === "backWithLogo") {
    return (
      <S.HeaderWrapper>
        <S.BackButton src={backBtn} alt="뒤로가기" onClick={props.onBack} />
        <S.Logo src={headerLogo} alt="로고" />
      </S.HeaderWrapper>
    );
  }

  return;
};

export default Header;
