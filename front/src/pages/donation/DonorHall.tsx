import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import background from "../../assets/images/background/back_yellow.png";
import { useNavigate } from "react-router-dom";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import hallLogo from "../../assets/images/logo/hall_logo.png";
import Top3Donor from "../../components/ui/Top3Donor";
import storeImage from "../../assets/images/store.png";
import user from "../../assets/images/icon/user.png";
import { colors } from "../../styles/colors";
import { useEffect, useMemo, useState } from "react";
import api from "../../../axiosConfig";

type LeaderboardItem = {
  user_id: number;
  name: string;
  profile_image_url: string | null;
  total_count: number;
  first_donation_at: string;
};

const DonorHall = () => {
  const navigate = useNavigate();

  const START_RANK = 4;
  const MAX_RANK = 10;
  const RANK_SLOTS = Array.from(
    { length: MAX_RANK - START_RANK + 1 },
    (_, i) => START_RANK + i
  );

  const [rest, setRest] = useState<
    {
      id: string;
      rank: number;
      name: string;
      donationCount: number;
      avatar: string;
    }[]
  >([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get<LeaderboardItem[]>("/leaderboard/all");
        if (!mounted) return;

        const sliced = (data ?? []).slice(3, 10);

        const mapped = sliced.map((d, idx) => ({
          id: `r${START_RANK + idx}`,
          rank: START_RANK + idx,
          name: d.name,
          donationCount: d.total_count,
          avatar: d.profile_image_url || user,
        }));

        setRest(mapped);
      } catch (e: any) {
        alert(
          e?.reponse?.data?.message ||
            e?.message ||
            "순위 정보를 불러오지 못했습니다."
        );
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const restByRank = useMemo(
    () => new Map(rest.map((d) => [d.rank, d])),
    [rest]
  );

  return (
    <>
      <Container>
        <Header variant="backWithLogo" onBack={() => navigate("/")} />

        <Section>
          <Logo src={hallLogo} alt="명예의 전당 로고" />
          <Top3Donor />
          <RankCard>
            {RANK_SLOTS.map((rank) => {
              const d = restByRank.get(rank);
              const isEmpty = !d;
              return (
                <Row key={rank} data-empty={isEmpty}>
                  <RowLeft>
                    <Rank>{rank}</Rank>
                    {isEmpty ? (
                      <ImagePlaceHolder src={user} alt="이미지 없음" />
                    ) : (
                      <Image src={d!.avatar} alt={`${d!.name} 이미지`} />
                    )}
                    <Name>{d?.name ?? ""}</Name>
                  </RowLeft>
                  <Count>{d ? `기부 ${d.donationCount}회` : ""}</Count>
                </Row>
              );
            })}
          </RankCard>
        </Section>
      </Container>
      <BottomTab />
    </>
  );
};

export default DonorHall;

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

const Section = styled.section`
  position: relative;
  width: 100%;
  margin-top: 14px;
  padding: 20px 0 60px 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

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

const Logo = styled.img`
  height: 67.4px;
`;

const RankCard = styled.div`
  width: 100%;
  height: 448px;
  border-radius: 20px;
  background: #fff;
  margin-top: 30px;
`;

const Row = styled.div`
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  &:not(:last-child) {
    border-bottom: 1px solid #d0d0d0;
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Rank = styled.span`
  font-family: ROKAFSans, Pretendard, sans-serif;
  color: ${colors.red};
  font-size: 20px;
  font-weight: 500;
`;

const ImagePlaceHolder = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 40px;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  object-fit: cover;
`;

const Name = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const Count = styled.span`
  color: ${colors.gray7};
  font-size: 11px;
  font-weight: 400;
`;
