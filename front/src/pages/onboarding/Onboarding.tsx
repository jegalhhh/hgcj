import obd_title from "../../assets/images/onboarding/obd_title.png";
import obd_back from "../../assets/images/onboarding/obd_back.png";
import logo from "../../assets/images/onboarding/logo.png";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../components/button/SecondaryButton";
import { mq, preset } from "../../styles/breakpoints";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <ImageWrapper>
          <Title src={obd_title} alt="온보딩 텍스트" />
          <Logo src={logo} alt="로고" />
          <Background src={obd_back} alt="배경" />
        </ImageWrapper>
        <ButtonWrapper>
          <SecondaryButton
            title="로그인"
            onClick={() => navigate("/auth/login")}
          />
          <SecondaryButton
            title="비회원 로그인"
            onClick={() => navigate("/donation")}
          />
          <SignupWrapper onClick={() => navigate("/auth/signup")}>
            <Text>회원가입</Text>
            <Line />
          </SignupWrapper>
        </ButtonWrapper>
      </Container>
    </>
  );
};

export default Onboarding;

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
  justify-content: space-between;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 56px;
  gap: 24px;

  ${mq.up("sm")} {
    margin-top: 72px;
    gap: 28px;
  }
  ${mq.up("md")} {
    margin-top: 96px;
    gap: 34px;
  }
  ${mq.up("lg")} {
    margin-top: 111px;
    gap: 40px;
  }
  ${preset.xsShort} {
    margin-top: 48px;
    gap: 16px;
  }
`;

const Title = styled.img`
  width: 200px;
  height: auto;

  ${mq.up("sm")} {
    width: 230px;
  }
  ${mq.up("md")} {
    width: 250px;
  }
  ${mq.up("lg")} {
    width: 274px;
  }
  ${preset.xsShort} {
    width: 188px;
  }
`;

const Logo = styled.img`
  width: 220px;
  height: auto;

  ${mq.up("sm")} {
    width: 270px;
  }
  ${mq.up("md")} {
    width: 300px;
  }
  ${mq.up("lg")} {
    width: 328px;
  }
  ${preset.xsShort} {
    width: 210px;
  }
`;

const Background = styled.img`
  position: absolute;
  bottom: calc(-1 * var(--padBottom, 44px));
  left: calc(-1 * var(--gutter, 24px));
  width: calc(100% + (var(--gutter, 24px) * 2));
  height: auto;
  max-width: none;
  aspect-ratio: 446.8 / 317.55;
  z-index: 0;

  ${preset.xsShort} {
    bottom: calc(-1 * var(--padBottom, 44px) + 10px);
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  ${mq.up("sm")} {
    gap: 14px;
  }
  ${mq.up("md")} {
    gap: 15px;
  }
  ${mq.up("lg")} {
    gap: 16px;
  }
  ${preset.xsShort} {
    gap: 10px;
  }
`;

const SignupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const Text = styled.span`
  color: #2d2d2d;
  text-align: center;
  font-size: 15px;
  font-weight: 400;
`;

const Line = styled.div`
  width: 60px;
  height: 1px;
  background: #2d2d2d;
`;
