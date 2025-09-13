import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import background from "../../assets/images/background/back_yellow.png";
import { useNavigate } from "react-router-dom";
import BottomTab from "../../components/common/BottomTab/BottomTab";

const DonationHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Background src={background} alt="로그인 배경" />
        <Header variant="backWithLogo" onBack={() => navigate("/")} />
      </Container>
      <BottomTab />
    </>
  );
};

export default DonationHome;

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

const Background = styled.img`
  position: absolute;
  bottom: calc(-1 * var(--padBottom, 44px));
  left: calc(-1 * var(--gutter, 24px));
  width: calc(100% + (var(--gutter, 24px) * 2));
  height: calc(
    var(--padBottom, 44px) + max(577px, calc(min(100vw, 420px) * 621 / 448.62))
  );
  max-width: none;
  object-fit: cover;
  object-position: top;
  z-index: 0;
`;
