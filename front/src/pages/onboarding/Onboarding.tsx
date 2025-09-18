import obd_title from "../../assets/images/onboarding/obd_title.png";
import obd_back from "../../assets/images/background/obd_back.png";
import logo from "../../assets/images/logo/main_logo.png";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../components/button/SecondaryButton";
import { mq, preset } from "../../styles/breakpoints";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <ImageSection>
          <Title src={obd_title} alt="온보딩 텍스트" />
          <Logo src={logo} alt="로고" />
        </ImageSection>
        <ButtonSection>
          <SecondaryCompact
            title="로그인"
            onClick={() => navigate("/auth/login")}
          />
          <SecondaryCompact
            title="비회원 로그인"
            onClick={() => navigate("/donation")}
          />
          <SignupSection onClick={() => navigate("/auth/signup")}>
            <Text>회원가입</Text>
            <Line />
          </SignupSection>
        </ButtonSection>
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

const ImageSection = styled.div`
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

const ButtonSection = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 68px 0 0 0;
  margin-top: 88px;

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

  &::before {
    content: "";
    position: absolute;
    inset: 0 calc(-1 * var(--gutter, 24px)) calc(-1 * var(--padBottom, 42px));
    background-image: url(${obd_back});
    background-repeat: repeat-y;
    background-size: 100% auto;
    background-position: top center;
    z-index: -1;
    pointer-events: none;
  }
`;

const SecondaryCompact = styled(SecondaryButton)`
  ${preset.xsShort} {
    height: 50px;
    border-radius: 35px;
    font-size: 10px;
  }
`;

const SignupSection = styled.div`
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
