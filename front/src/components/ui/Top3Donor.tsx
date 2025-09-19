import styled from "styled-components";
import top1 from "../../assets/images/donation/top1.png";
import top2 from "../../assets/images/donation/top2.png";
import top3 from "../../assets/images/donation/top3.png";
import user from "../../assets/images/icon/user.png";
import { useEffect, useMemo, useState } from "react";
import api from "../../../axiosConfig";

type Props = {
  onClick?: () => void;
};

type TopDonor = {
  user_id: number;
  name: string;
  profile_image_url: string | null;
  total_count: number;
  first_donation_at: string;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "https://hgcj-back.vercel.app";

function toAbsoluteUrl(url?: string | null) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:"))
    return trimmed;
  return `${API_BASE}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

const Top3Donor = ({ onClick }: Props) => {
  const [items, setItems] = useState<TopDonor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<TopDonor[]>("/leaderboard/top3");
        if (!mounted) return;
        setItems((res.data ?? []).slice(0, 3));
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e.message ||
          "순위 정보를 불러오지 못했습니다.";
        alert(msg);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const ranked = useMemo(() => {
    const filled: (TopDonor | null)[] = [...items];
    while (filled.length < 3) filled.push(null);
    const order = [1, 0, 2];
    return order.map((i) => filled[i] ?? null);
  }, [items]);

  const second = ranked[0];
  const first = ranked[1];
  const third = ranked[2];

  return (
    <>
      <Podium onClick={onClick}>
        <PodiumCard data-rank="2" $h={206}>
          <CardContent>
            <DonorImage
              src={
                loading
                  ? user
                  : toAbsoluteUrl(second?.profile_image_url) || user
              }
              alt="가게이미지"
            />
            <TextWrapper>
              <DonorName>{loading ? "None" : second?.name ?? "None"}</DonorName>
              <DonotStat>
                {loading
                  ? "기부   회"
                  : `기부 ${second?.total_count ?? "  "}회`}
              </DonotStat>
            </TextWrapper>
          </CardContent>
        </PodiumCard>
        <PodiumCard data-rank="1" $h={240}>
          <CardContent>
            <DonorImage
              data-rank="1"
              src={
                loading ? user : toAbsoluteUrl(first?.profile_image_url) || user
              }
              alt="가게이미지"
            />
            <TextWrapper>
              <DonorName data-rank="1">
                {loading ? "None" : first?.name ?? "None"}
              </DonorName>
              <DonotStat data-rank="1">
                {loading ? "기부   회" : `기부 ${first?.total_count ?? "  "}회`}
              </DonotStat>
            </TextWrapper>
          </CardContent>
        </PodiumCard>
        <PodiumCard data-rank="3" $h={206}>
          <CardContent>
            <DonorImage
              src={
                loading ? user : toAbsoluteUrl(third?.profile_image_url) || user
              }
              alt="가게이미지"
            />
            <TextWrapper>
              <DonorName>{loading ? "None" : third?.name ?? "None"}</DonorName>
              <DonotStat>
                {loading ? "기부   회" : `기부 ${third?.total_count ?? "  "}회`}
              </DonotStat>
            </TextWrapper>
          </CardContent>
        </PodiumCard>
      </Podium>
    </>
  );
};

export default Top3Donor;

const Podium = styled.div`
  width: 100%;
  height: 253px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  isolation: isolate;
  overflow: visible;
  transform: translateX(3px);
`;

const PodiumCard = styled.article<{ $h?: number }>`
  position: relative;
  flex: 0 0 auto;
  box-sizing: border-box;
  z-index: var(--z, 1);

  height: ${({ $h }) => ($h ? `${$h}px` : "206px")};
  aspect-ratio: 146 / 249;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: contain;

  &[data-rank="1"] {
    background-image: url(${top1});
    padding: 45px 33px 0 20px;
  }
  &[data-rank="2"] {
    background-image: url(${top2});
    padding: 30px 30px 0 21.65px;
  }
  &[data-rank="3"] {
    background-image: url(${top3});
    padding: 30px 25px 0 18px;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &[data-rank="1"] {
    gap: 6.59px;
  }
`;

const DonorImage = styled.img`
  position: relative;
  z-index: 2;
  border-radius: 64px;
  width: 64px;
  height: 64px;
  object-fit: cover;
  display: block;

  &[data-rank="1"] {
    width: 86.58px;
    height: 86.58px;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const DonorName = styled.span`
  font-size: 13px;
  font-weight: 600;
  line-height: 15.6px;
`;

const DonotStat = styled.span`
  font-size: 9px;
  font-weight: 400;
`;
