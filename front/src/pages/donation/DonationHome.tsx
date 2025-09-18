import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import background from "../../assets/images/background/back_yellow.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import { colors } from "../../styles/colors";
import plusIcon from "../../assets/images/icon/plus.png";
import card from "../../assets/images/donation/card.png";
import IconButton from "../../components/button/IconButton";
import hallLogo from "../../assets/images/logo/hall_logo.png";
import Top3Donor from "../../components/ui/Top3Donor";
import TopDonorCard from "../../components/ui/TopDonorCard";
import { useEffect, useState } from "react";
import api from "../../../axiosConfig";

type StampCount = {
  total_donations: number;
  verified_donations: number;
};

const DonationHome = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [counts, setCounts] = useState<StampCount>({
    total_donations: 0,
    verified_donations: 0,
  });

  useEffect(() => {
    let mounted = true;

    const fetchCounts = async () => {
      // 비회원일 경우 API 호출 안함
      if (!authState.isLoggedIn) {
        return;
      }
      
      try {
        const { data } = await api.get<StampCount>("/donations/me/stamps");
        if (!mounted) return;
        setCounts({
          total_donations: Number(data?.total_donations ?? 0),
          verified_donations: Number(data?.verified_donations ?? 0),
        });
      } catch (e: any) {
        alert(
          e?.response?.data?.message ||
            e?.message ||
            "내 기부 현황을 불러오지 못했습니다."
        );
      }
    };

    fetchCounts();

    const onStorage = () => {
      const hasToken = !!localStorage.getItem("ACCESS_TOKEN");
      if (hasToken) fetchCounts();
      else setCounts({ total_donations: 0, verified_donations: 0 });
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <>
      <Container>
        <Header variant="logo" />

        <TopSection>
          <DonationButton 
            onClick={() => {
              if (authState.isGuest) {
                alert("기부 인증은 회원만 가능합니다. 회원가입 후 이용해주세요.");
                navigate("/");
              } else {
                navigate("/donation/certify");
              }
            }}
          >
            <DonationText>
              기부
              <br />
              인증하기
            </DonationText>
            <PlusIcon>
              <IconButton
                icon={plusIcon}
                alt="추가아이콘"
                onClick={() => navigate("/donation/hall")}
                size={29}
              />
            </PlusIcon>
          </DonationButton>
          <DonationStatusCard 
            onClick={() => {
              if (authState.isGuest) {
                alert("마이페이지는 회원만 이용 가능합니다. 회원가입 후 이용해주세요.");
                navigate("/");
              } else {
                navigate("/mypage");
              }
            }}
          >
            <StatusText>
              {authState.isGuest ? "비회원 모드" : "내 기부 현황"}
            </StatusText>
            <RowSection>
              <StatusRow>
                <RowText>기부 횟수</RowText>
                <RowTextBold>
                  {authState.isGuest ? "-" : `${counts.total_donations}회`}
                </RowTextBold>
              </StatusRow>
              <StatusRow>
                <RowText>스탬프</RowText>
                <RowTextBold>
                  {authState.isGuest ? "-" : `${counts.verified_donations}개`}
                </RowTextBold>
              </StatusRow>
            </RowSection>
          </DonationStatusCard>
        </TopSection>

        <BottomSection>
          <Logo src={hallLogo} alt="명예의 전당 로고" />
          <Top3Donor onClick={() => navigate("/donation/hall")} />
          <TopDonorCard />
        </BottomSection>
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

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
`;

const DonationButton = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 152px;
  padding: 17px 16px;
  gap: 30px;
  border-radius: 20px;
  border: 2px dashed ${colors.green};
  background: #fff;
  box-shadow: -4px 4px 0 0 rgba(0, 0, 0, 0.03) inset;
`;

const PlusIcon = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DonationText = styled.div`
  font-size: 20px;
  font-family: ROKAFSans, Pretendard, sans-serif;
  font-weight: 500;
`;

const StatusText = styled.div`
  font-size: 17px;
  font-family: ROKAFSans, Pretendard, sans-serif;
  font-weight: 500;
`;

const DonationStatusCard = styled.div`
  width: 100%;
  height: 152px;
  background-image: url(${card});
  background-size: cover;
  background-position: center;
  padding: 17px 16px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RowSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusRow = styled.div`
  width: 100%;
  height: 32px;
  padding: 4px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 100px;
  background: #fff;
  box-shadow: -2px 2px 0 0 rgba(0, 0, 0, 0.07) inset;
`;

const RowText = styled.span`
  font-size: 15px;
  font-weight: 400;
`;

const RowTextBold = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const BottomSection = styled.section`
  position: relative;
  width: 100%;
  margin-top: 48px;
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
