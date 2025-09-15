import styled from "styled-components";
import top1 from "../../assets/images/donation/top1.png";
import top2 from "../../assets/images/donation/top2.png";
import top3 from "../../assets/images/donation/top3.png";
import store from "../../assets/images/store.png";

type Props = {
  onClick?: () => void;
};

const Top3Donor = ({ onClick }: Props) => {
  return (
    <>
      <Podium onClick={onClick}>
        <PodiumCard data-rank="2" $h={206}>
          <CardContent>
            <DonorImage src={store} alt="가게이미지" />
            <TextWrapper>
              <DonorName>가게2</DonorName>
              <DonotStat>기부 50회</DonotStat>
            </TextWrapper>
          </CardContent>
        </PodiumCard>
        <PodiumCard data-rank="1" $h={240}>
          <CardContent>
            <DonorImage data-rank="1" src={store} alt="가게이미지" />
            <TextWrapper>
              <DonorName data-rank="1">가게1</DonorName>
              <DonotStat data-rank="1">기부 50회</DonotStat>
            </TextWrapper>
          </CardContent>
        </PodiumCard>
        <PodiumCard data-rank="3" $h={206}>
          <CardContent>
            <DonorImage src={store} alt="가게이미지" />
            <TextWrapper>
              <DonorName>가게3</DonorName>
              <DonotStat>기부 50회</DonotStat>
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
