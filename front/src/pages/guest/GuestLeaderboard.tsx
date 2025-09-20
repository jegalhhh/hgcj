import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import background from "../../assets/images/background/back_yellow.png";
import { useNavigate } from "react-router-dom";
import hallLogo from "../../assets/images/logo/hall_logo.png";
import Top3Donor from "../../components/ui/Top3Donor";
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

const GuestLeaderboard = () => {
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
        console.error("순위 정보 로드 실패:", e);
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

  const handleBackToLogin = () => {
    // 비회원 모드 완전히 종료
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Container>
        <Background src={background} alt="배경" />
        
        <Header 
          variant="backWithTitle" 
          title="기부 리더보드 (비회원)"
          onBack={handleBackToLogin}
        />

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
          
          <GuestNotice>
            <NoticeText>🔒 비회원 모드</NoticeText>
            <NoticeSubText>
              회원가입하시면 기부 인증, 스탬프 수집 등<br/>
              모든 기능을 이용하실 수 있습니다.
            </NoticeSubText>
            <SignupButton onClick={() => navigate("/auth/signup")}>
              회원가입하기
            </SignupButton>
            <LoginButton onClick={() => navigate("/auth/login")}>
              로그인하기
            </LoginButton>
          </GuestNotice>
        </Section>
      </Container>
    </>
  );
};

export default GuestLeaderboard;

const Container = styled.div`
  width: 100%;
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Background = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
`;

const RankCard = styled.div`
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &[data-empty="true"] {
    opacity: 0.3;
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Rank = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.green};
  width: 20px;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ImagePlaceHolder = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  opacity: 0.3;
`;

const Name = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const Count = styled.span`
  font-size: 14px;
  color: ${colors.gray5};
`;

const GuestNotice = styled.div`
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid ${colors.green};
`;

const NoticeText = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.green};
  margin-bottom: 10px;
`;

const NoticeSubText = styled.div`
  font-size: 14px;
  color: ${colors.gray6};
  line-height: 1.5;
  margin-bottom: 20px;
`;

const SignupButton = styled.button`
  width: 100%;
  height: 50px;
  background: ${colors.green};
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  cursor: pointer;
  
  &:hover {
    background: ${colors.gray7};
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 50px;
  background: white;
  color: ${colors.green};
  border: 2px solid ${colors.green};
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
`;
