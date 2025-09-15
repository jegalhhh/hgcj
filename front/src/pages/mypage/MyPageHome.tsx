import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import background from "../../assets/images/background/back_green.png";
import { useNavigate } from "react-router-dom";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import storeImage from "../../assets/images/store.png";
import right from "../../assets/images/icon/right.png";
import check from "../../assets/images/icon/check.png";
import stamp from "../../assets/images/icon/stamp.png";
import { colors } from "../../styles/colors";

const MyPageHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Header variant="title" title="마이페이지" />

        <TopSection>
          <UserImage src={storeImage} alt="사용자 프로필" />
          <UserName>이름</UserName>
        </TopSection>

        <BottomSection>
          <CardTitle>내 기부내역</CardTitle>
          <StatusCard>
            <CardContent onClick={() => navigate("/mypage/history")}>
              <Row>
                <CardText>기부 횟수</CardText>
                <RightIcon src={right} alt="기부 횟수 바로가기" />
              </Row>
              <Circle>
                <CheckIcon src={check} alt="기부 횟수 바로가기" />
                <CircleText>2회</CircleText>
              </Circle>
            </CardContent>
            <CardContent onClick={() => navigate("/mypage/stamp")}>
              <Row>
                <CardText>스탬프</CardText>
                <RightIcon src={right} alt="스탬프 바로가기" />
              </Row>
              <Circle>
                <StampIcon src={stamp} alt="스탬프 바로가기" />
                <CircleText>3개</CircleText>
              </Circle>
            </CardContent>
          </StatusCard>
        </BottomSection>
      </Container>

      <BottomTab />
    </>
  );
};

export default MyPageHome;

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

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
`;

const UserImage = styled.img`
  width: 116px;
  height: 116px;
  border-radius: 116px;
  object-fit: cover;
`;

const UserName = styled.span`
  font-family: ROKAFSans, Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 500;
`;

const BottomSection = styled.section`
  position: relative;
  width: 100%;
  margin-top: 48px;
  padding: 42px 0 313px 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &::before {
    content: "";
    position: absolute;
    inset: 0 calc(-1 * var(--gutter, 24px)) calc(-1 * var(--padBottom, 42px));
    background-image: url(${background});
    background-repeat: repeat-y;
    background-size: 100% auto;
    background-position: top center;
    z-index: -1;
    pointer-events: none;
  }
`;

const CardTitle = styled.span`
  font-size: 17px;
  font-weight: 600;
`;

const StatusCard = styled.div`
  width: 100%;
  height: 121px;
  padding: 16px;
  gap: 14px;
  border-radius: 20px;
  background: #fff;
  display: flex;
  flex-direction: row;
  position: relative;
  margin-top: 12px;

  &::after {
    content: "";
    position: absolute;
    top: 16px;
    bottom: 16px;
    left: 50%;
    width: 1px;
    transform: translateX(-0.5px);
    background: ${colors.green};
    pointer-events: none;
  }

  > * {
    flex: 1 1 0;
    display: flex;
    align-items: center;
  }

  > :first-child {
    padding-right: 8px;
  }
  > :last-child {
    padding-left: 8px;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RightIcon = styled.img`
  width: 7px;
  height: 16px;
`;

const CardText = styled.span`
  font-size: 15px;
  font-weight: 400;
`;

const Circle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 999px;
  border: 1px solid ${colors.green};
  background: ${colors.light_green};
`;

const CircleText = styled.span`
  font-size: 15px;
  font-weight: 600;
  padding: 0;
  margin: 0;
`;

const CheckIcon = styled.img`
  position: absolute;
  width: 22px;
  height: 22px;
  left: -8.86px;
  bottom: -0.19px;
`;

const StampIcon = styled.img`
  position: absolute;
  width: 22px;
  height: 26px;
  left: -8.86px;
  bottom: -0.19px;
`;
