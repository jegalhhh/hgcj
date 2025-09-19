import obd_title from "../../assets/images/onboarding/obd_title.png";
import obd_back from "../../assets/images/background/obd_back.png";
import logo from "../../assets/images/logo/main_logo.png";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../components/button/SecondaryButton";

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
  margin-top: clamp(48px, 12vmin, 111px);
  gap: clamp(16px, 4vmin, 40px);
`;

const Title = styled.img`
  width: clamp(250px, calc(0.905263vmin - 101.684px), 274px);
  height: auto;
`;

const Logo = styled.img`
  width: clamp(310px, calc(1.242105vmin - 187.474px), 328px);
  height: auto;
`;

const ButtonSection = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(10px, 2.5vmin, 16px);
  padding: 68px 0 0 0;
  margin-top: 88px;

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
  height: clamp(58px, 6vmin, 63px);
  border-radius: clamp(35px, 6vmin, 42px);
  font-size: clamp(13px, 2.8vmin, 16px;);
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
