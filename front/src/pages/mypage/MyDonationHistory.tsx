import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import SelectButton from "../../components/button/SelectButton";
import HistoryCard from "../../components/ui/HistoryCard";
import { colors } from "../../styles/colors";

const DUMMY_HISTORY = [
  {
    id: "a1",
    timestamp: new Date("2025-09-10T12:13:00").getTime(),
    status: "기부완료",
    image: "https://picsum.photos/seed/d1/120/120",
    title: "컵케이크 6개",
    quantity: 6,
  },
  {
    id: "a2",
    timestamp: new Date("2025-08-25T09:30:00").getTime(),
    status: "기부완료",
    image: "https://picsum.photos/seed/d2/120/120",
    title: "과일 도시락",
    quantity: 3,
  },
  {
    id: "a3",
    timestamp: new Date("2025-07-20T15:45:00").getTime(),
    status: "대기중",
    image: "https://picsum.photos/seed/d3/120/120",
    title: "샌드위치",
    quantity: 5,
  },
  {
    id: "a4",
    timestamp: new Date("2025-06-15T11:00:00").getTime(),
    status: "기부완료",
    image: "https://picsum.photos/seed/d4/120/120",
    title: "쿠키 박스",
    quantity: 2,
  },
  {
    id: "a5",
    timestamp: new Date("2025-05-01T18:20:00").getTime(),
    status: "기부완료",
    image: "https://picsum.photos/seed/d5/120/120",
    title: "초콜릿 세트",
    quantity: 1,
  },
];

const MyDonationHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"전체" | "1개월" | "3개월">("전체");

  const donationCount = 3;

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
      DUMMY_HISTORY.filter((i) => filterByDate(i.timestamp)).sort(
        (a, b) => b.timestamp - a.timestamp
      ),
    [filter]
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
              status={item.status as "기부완료" | "대기중"}
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
