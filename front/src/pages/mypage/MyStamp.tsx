import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import background from "../../assets/images/background/stamp_back.png";
import { useLocation, useNavigate } from "react-router-dom";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import { colors } from "../../styles/colors";
import tomatoGray from "../../assets/images/stamp/tomato.png";
import tomatoColor from "../../assets/images/stamp/tomato_color.svg";
import paprikaGray from "../../assets/images/stamp/paprika.png";
import paprikaColor from "../../assets/images/stamp/paprika_color.svg";
import milkGray from "../../assets/images/stamp/milk.png";
import milkColor from "../../assets/images/stamp/milk_color.svg";
import broccoliGray from "../../assets/images/stamp/broccoli.png";
import broccoliColor from "../../assets/images/stamp/broccoli_color.svg";
import breadGray from "../../assets/images/stamp/bread.png";
import breadColor from "../../assets/images/stamp/bread_color.svg";
import puddingGray from "../../assets/images/stamp/pudding.png";
import puddingColor from "../../assets/images/stamp/pudding_color.svg";
import strawberryGray from "../../assets/images/stamp/strawberry.png";
import strawberryColor from "../../assets/images/stamp/strawberry_color.svg";
import peachGray from "../../assets/images/stamp/peach.png";
import peachColor from "../../assets/images/stamp/peach_color.svg";
import cucumberGray from "../../assets/images/stamp/cucumber.png";
import cucumberColor from "../../assets/images/stamp/cucumber_color.svg";
import potGray from "../../assets/images/stamp/pot.png";
import potColor from "../../assets/images/stamp/pot_color.svg";

const STAMPS = [
  {
    key: "tomato",
    gray: tomatoGray,
    color: tomatoColor,
    top: -30,
    left: 55,
    rotation: -10,
  },
  {
    key: "paprika",
    gray: paprikaGray,
    color: paprikaColor,
    top: -30,
    left: 195,
    rotation: 10,
  },
  {
    key: "milk",
    gray: milkGray,
    color: milkColor,
    top: 100,
    left: -10,
    rotation: -10,
  },
  {
    key: "broccoli",
    gray: broccoliGray,
    color: broccoliColor,
    top: 100,
    left: 125,
    rotation: 0,
  },
  {
    key: "bread",
    gray: breadGray,
    color: breadColor,
    top: 100,
    left: 255,
    rotation: 10,
  },
  {
    key: "pudding",
    gray: puddingGray,
    color: puddingColor,
    top: 255,
    left: 55,
    rotation: 12,
  },
  {
    key: "strawberry",
    gray: strawberryGray,
    color: strawberryColor,
    top: 255,
    left: 205,
    rotation: -8,
  },
  {
    key: "peach",
    gray: peachGray,
    color: peachColor,
    top: 390,
    left: 0,
    rotation: 0,
  },
  {
    key: "cucumber",
    gray: cucumberGray,
    color: cucumberColor,
    top: 390,
    left: 130,
    rotation: 0,
  },
  {
    key: "poster",
    gray: potGray,
    color: potColor,
    top: 390,
    left: 265,
    rotation: 0,
  },
];

type StampState = { stampCount?: number };

const MyStamp = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: StampState };

  const stampCount =
    typeof state?.stampCount === "number" ? state.stampCount : 0;

  return (
    <>
      <Container>
        <Header
          variant="backWithTitle"
          title="스탬프 모아보기"
          onBack={() => navigate("/mypage")}
        />

        <TopSection>
          <BoldText>총 {stampCount}개의 스탬프를 모았어요!</BoldText>
          <DetailText>스탬프를 모으면 봉사시간으로 교환할 수 있어요</DetailText>
        </TopSection>

        <BottomSection>
          <Background src={background} alt="stamp path" />
          {STAMPS.map((s, idx) => {
            const src = idx < stampCount ? s.color : s.gray;
            return (
              <Stamp
                key={s.key}
                src={src}
                alt={s.key}
                style={{
                  top: `${s.top}px`,
                  left: `${s.left}px`,
                  transform: `rotate(${s.rotation ?? 0}deg)`,
                }}
              />
            );
          })}
        </BottomSection>
      </Container>
      <BottomTab />
    </>
  );
};

export default MyStamp;

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
  width: 100%;
  margin-top: 15px;
  gap: 4px;
`;

const BoldText = styled.span`
  font-family: ROKAFSans, Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 500;
`;

const DetailText = styled.span`
  color: ${colors.gray5};
  font-size: 15px;
  font-weight: 400;
`;

const BottomSection = styled.section`
  position: relative;
  margin-top: 78px;
`;

const Background = styled.img``;

const Stamp = styled.img`
  position: absolute;
  width: 100px;
  height: 100px;
`;
