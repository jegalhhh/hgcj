import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SelectButton from "../../components/button/SelectButton";
import HistoryCard from "../../components/ui/HistoryCard";
import { colors } from "../../styles/colors";
import api from "../../../axiosConfig";

type Donation = {
  id: number;
  item_name: string;
  quantity: number;
  image_url: string | null;
  verified: boolean;
  created_at: string;
};

type HistoryItem = {
  id: string;
  timestamp: number;
  status: "기부완료" | "대기중";
  image: string;
  title: string;
  quantity: number;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://hgcj-back.vercel.app";
const FALLBACK_IMG = "https://placehold.co/120x120?text=No+Image";

function toAbsoluteUrl(url?: string | null) {
  console.log("toAbsoluteUrl input:", url);
  if (!url) {
    console.log("No URL provided");
    return "";
  }
  const u = url.trim();
  if (!u) {
    console.log("Empty URL after trim");
    return "";
  }
  if (/^https?:\/\//i.test(u) || u.startsWith("data:")) {
    console.log("Returning as-is (HTTP/HTTPS/data URL):", u.substring(0, 50) + "...");
    return u;
  }
  const result = `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
  console.log("Converted to absolute URL:", result);
  return result;
}

const MyDonationHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"전체" | "1개월" | "3개월">("전체");
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get<Donation[]>("/donations/me");
        if (!mounted) return;

        const mapped: HistoryItem[] = (data ?? []).map((d) => ({
          id: String(d.id),
          timestamp: new Date(d.created_at).getTime(),
          status: d.verified ? "기부완료" : "대기중",
          image: toAbsoluteUrl(d.image_url) || FALLBACK_IMG,
          title: d.item_name,
          quantity: d.quantity,
        }));

        setItems(mapped);
      } catch (e: any) {
        alert(
          e?.response?.data?.message ||
            e?.message ||
            "기부내역을 불러오지 못했습니다."
        );
      }
    })();
  }, []);

  const donationCount = items.length;

  const filterByDate = (timestamp: number) => {
    const now = Date.now();
    if (filter === "1개월") {
      const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
      return timestamp >= oneMonthAgo;
    }
    if (filter === "3개월") {
      const threeMonthAgo = now - 90 * 24 * 60 * 60 * 1000;
      return timestamp >= threeMonthAgo;
    }
    return true;
  };

  const filtered = useMemo(
    () =>
      items
        .filter((i) => filterByDate(i.timestamp))
        .sort((a, b) => b.timestamp - a.timestamp),
    [items, filter]
  );

  return (
    <>
      <Container>
        <Header
          variant="backWithTitle"
          title="기부내역"
          onBack={() => navigate("/mypage")}
        />
        <LabeledSection>
          <TopLabel>
            <Text>기부 횟수</Text>
            <Count>{donationCount}회</Count>
          </TopLabel>
          <SelectLabel>
            {(["전체", "1개월", "3개월"] as const).map((label) => (
              <SelectButton
                key={label}
                title={label}
                isSelected={filter == label}
                onClick={() => setFilter(label)}
              />
            ))}
          </SelectLabel>
        </LabeledSection>

        <ScrollView>
          {filtered.map((item) => (
            <HistoryCard
              key={item.id}
              id={item.id}
              timestamp={item.timestamp}
              status={item.status}
              image={item.image}
              title={item.title}
              quantity={item.quantity}
            />
          ))}
        </ScrollView>
      </Container>

      <BottomTab />
    </>
  );
};

export default MyDonationHistory;

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

const LabeledSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TopLabel = styled.div`
  width: 100%;
  height: 46px;
  padding: 0 16px 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid ${colors.gray2};
`;

const SelectLabel = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 15px;
`;

const ScrollView = styled.div`
  width: 100%;
`;

const Text = styled.span`
  font-size: 15px;
  font-weight: 400;
`;

const Count = styled.span`
  font-size: 17px;
  font-weight: 600;
`;
