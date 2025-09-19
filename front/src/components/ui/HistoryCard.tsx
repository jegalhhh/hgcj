import styled from "styled-components";
import { colors } from "../../styles/colors";

type DonationProps = {
  id: string;
  title: string;
  timestamp: number;
  image: string;
  status: string;
  quantity: number;
};

const HistoryCard = ({
  title,
  timestamp,
  image,
  status,
  quantity,
}: DonationProps) => {
  const date = new Date(timestamp);
  const yy = String(date.getFullYear() % 100).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const weekday = date.toLocaleDateString("ko-KR", {
    weekday: "short",
    timeZone: "Asia/Seoul",
  });
  const formattedDate = `${yy}.${mm}.${dd} (${weekday})`;

  const formattedTime = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Seoul",
  });

  return (
    <>
      <Card>
        <TopRow>
          <DateRow>
            <DateText>{formattedDate}</DateText>
            <Time>{formattedTime}</Time>
          </DateRow>
          <Status>{status}</Status>
        </TopRow>
        <ContentRow>
          <Thumbnail src={image} />
          <ItemCol>
            <ItemTitle>{title}</ItemTitle>
            <ItemCount>{quantity}개</ItemCount>
          </ItemCol>
        </ContentRow>
      </Card>
    </>
  );
};

export default HistoryCard;

const Card = styled.div`
  width: 100%;
  height: 163px;
  background-color: white;
  border: 1px solid ${colors.gray2};
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 12px;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DateRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const DateText = styled.span`
  font-size: 15px;
  font-weight: 400;
`;

const Time = styled.div`
  color: ${colors.gray5};
  font-size: 13px;
  font-weight: 400;
  line-height: 15.6px;
`;

const Status = styled.div`
  color: ${colors.gray5};
  font-size: 15px;
  font-weight: 600;
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 12px;
  align-items: center;
`;

const Thumbnail = styled.img`
  width: 92px;
  height: 92px;
  border-radius: 8px;
`;

const ItemCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const ItemCount = styled.span`
  font-size: 15px;
  font-weight: 400;
`;
