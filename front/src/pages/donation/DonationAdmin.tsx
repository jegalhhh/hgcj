import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import api from "../../../axiosConfig";
import PendingCard from "../../components/ui/PendingCard";
import { colors } from "../../styles/colors";

type PendingDonation = {
  id: number;
  donor?: string;
  item_name?: string;
  quantity?: number;
  image_url?: string | null;
  donation_date?: string;
  created_at?: string;
};

type HistoryItem = {
  id: string;
  timestamp: number;
  status: "기부완료" | "대기중";
  image: string;
  title: string;
  quantity: number;
};

const API_BASE =
  import.meta.env.VITE_API_URL ??
  "https://fastapi-386151446118.asia-northeast3.run.app";
const FALLBACK_IMG = "https://placehold.co/120x120?text=No+Image";

function toAbsoluteUrl(url?: string | null) {
  if (!url) return "";
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u) || u.startsWith("data:")) return u;
  return `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
}

const DonationAdmin = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    const { data } = await api.get<PendingDonation[]>(
      "/admin/donations/pending"
    );
    const mapped: HistoryItem[] = (data ?? []).map((d) => ({
      id: String(d.id),
      timestamp:
        Date.parse(d.donation_date || "") ||
        Date.parse(d.created_at || "") ||
        Date.now(),
      status: "대기중" as const,
      image: toAbsoluteUrl(d.image_url) || FALLBACK_IMG,
      title: d.item_name ?? "(품목 미상)",
      quantity: d.quantity ?? 0,
    }));
    setItems(mapped);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchList();
      } catch (e: any) {
        const st = e?.response?.status;
        if (st === 401 || st === 403) {
          alert("관리자 인증이 유효하지 않습니다. 다시 로그인해 주세요.");
          navigate("/mypage", { replace: true });
        } else {
          alert(e?.response?.data?.message || "목록을 불러오지 못했습니다.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchList, navigate]);

  const act = async (id: string, kind: "approve" | "reject") => {
    try {
      await api.post(`/admin/donations/${id}/${kind}`, null);
      await fetchList();
    } catch (e: any) {
      const st = e?.response?.status;
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (st ? `요청 실패(${st})` : "네트워크 오류");
      alert(msg);
    }
  };

  const handleBack = () => {
    if (loading) return;
    navigate("/mypage");
  };

  return (
    <>
      <Container aria-busy={loading}>
        <Header
          variant="backWithTitle"
          title="승인 대기 내역"
          onBack={handleBack}
        />
        <Line />
        <ScrollView>
          {loading ? (
            <Empty>불러오는 중…</Empty>
          ) : items.length === 0 ? (
            <Empty>대기 중인 기부가 없습니다.</Empty>
          ) : (
            items.map((item) => (
              <PendingCard
                key={item.id}
                id={item.id}
                timestamp={item.timestamp}
                image={item.image}
                title={item.title}
                quantity={item.quantity}
                onApprove={(id) => act(id, "approve")}
                onReject={(id) => act(id, "reject")}
              />
            ))
          )}
        </ScrollView>
      </Container>

      <BottomTab />
    </>
  );
};

export default DonationAdmin;

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

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.gray2};
  margin: 8px 0 20px;
`;

const ScrollView = styled.div`
  width: 100%;
`;

const Empty = styled.div`
  padding: 32px 0;
  color: #777;
  text-align: center;
`;
