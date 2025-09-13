import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import { mq, preset } from "../../styles/breakpoints";
import loginLogo from "../../assets/images/logo/login_logo.png";
import loginBack from "../../assets/images/background/login_back.png";
import LabeledInput from "../../components/form/LabeledInput";
import PrimaryButton from "../../components/button/PrimaryButton";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Background src={loginBack} alt="로그인 배경" />
        <Header
          variant="backWithTitle"
          title="로그인"
          onBack={() => navigate("/")}
        />
        <Logo src={loginLogo} alt="로고" />
        <FormWrapper>
          <InputWrapper>
            <LabeledInput label="이름" placeholder="이름을 입력하세요." />
            <LabeledInput
              label="비밀번호"
              placeholder="비밀번호를 입력하세요."
            />
          </InputWrapper>
          <PrimaryButton title="로그인" onClick={() => navigate("/donation")} />
        </FormWrapper>
      </Container>
    </>
  );
};

export default Login;

const Container = styled.div`
  width: 100%;
  position: relative;
  min-height: calc(100vh - (var(--padTop, 42px) + var(--padBottom, 42px)));
  @supports (height: 100svh) {
    min-height: calc(100svh - (var(--padTop, 42px) + var(--padBottom, 42px)));
  }
  @supports (height: 100dvh) {
    min-height: calc(100dvh - (var(--padTop, 42px) + var(--padBottom, 42px)));
  }
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  margin-top: 30px;
  width: 140px;
  height: auto;

  ${mq.up("sm")} {
    width: 140px;
  }
  ${mq.up("md")} {
    width: 160px;
  }
  ${mq.up("lg")} {
    width: 180px;
  }
  ${preset.xsShort} {
    width: 100px;
  }
`;

const Background = styled.img`
  position: absolute;
  bottom: calc(-1 * var(--padBottom, 44px));
  left: calc(-1 * var(--gutter, 24px));
  width: calc(100% + (var(--gutter, 24px) * 2));
  height: calc(
    var(--padBottom, 44px) + max(542px, calc(min(100vw, 420px) * 586 / 448.62))
  );
  max-width: none;
  object-fit: cover;
  object-position: top;
  z-index: 0;
`;

const FormWrapper = styled.div`
  z-index: 2;
  width: 100%;
  margin-top: 113px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 483px;

  ${mq.up("sm")} {
    height: 460px;
  }
  ${mq.up("md")} {
    height: 483px;
  }
  ${mq.up("lg")} {
    height: 500px;
  }
  ${preset.xsShort} {
    height: 450px;
  }
`;

const InputWrapper = styled.div``;
