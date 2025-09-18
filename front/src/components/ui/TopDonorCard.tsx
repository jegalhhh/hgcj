import styled from "styled-components";
import top1Donor from "../../assets/images/donation/top1_store.png";
import iconLogo from "../../assets/images/logo/icon_logo.png";
import storeImage from "../../assets/images/store.png";
import nextIcon from "../../assets/images/icon/next.png";
import { colors } from "../../styles/colors";

type Props = {
  storeName?: string;
  photos?: string[];
  detail?: string;
  onClick?: () => void;
};

const TopDonorCard = ({
  storeName = "가게이름",
  detail = "가게 홍보 어쩌구 가게 홍보 어쩌구 가게 홍보 어쩌구 가게 홍보 어쩌구",
  photos = [storeImage, storeImage, storeImage, storeImage],
  onClick,
}: Props) => {
  return (
    <>
      <Wrap onClick={onClick}>
        <Badge>
          <BadgeText>{storeName}</BadgeText>
        </Badge>
        <NextIcon src={nextIcon} alt="다음 이미지" />
        <Carousel>
          <List>
            {photos.map((src, i) => (
              <Item key={i}>
                <Img src={src} alt={`${storeName} 사진 ${i + 1}`} />
              </Item>
            ))}
          </List>
        </Carousel>
        <DetailRow>
          <IconLogo src={iconLogo} alt="ㅎ 로고" />
          <Detail>{detail}</Detail>
        </DetailRow>
      </Wrap>
    </>
  );
};

export default TopDonorCard;

const Wrap = styled.section`
  position: relative;
  width: 100%;
  min-height: 179px;
  border-radius: 20px;
  background: ${colors.cream};
  padding: 40px 8.5px 14px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-top: 49px;
`;

const Badge = styled.div`
  position: absolute;
  top: -15px;
  left: -2px;
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 130px 13px 150px;
  background-image: url(${top1Donor});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`;

const BadgeText = styled.span`
  font-family: ROKAFSans, Pretendard, sans-serif;
  font-weight: 500;
  font-size: 13px;
`;

const NextIcon = styled.img`
  position: absolute;
  top: 75px;
  right: -14px;
  width: 29px;
  height: 29px;
`;

const Carousel = styled.div`
  display: flex;
  flex-direction: row;
`;

const List = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  margin: 0;
  list-style: none;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Item = styled.li`
  flex: 0 0 auto;
  width: 93px;
  height: 93px;
  border-radius: 8px;
  overflow: hidden;
  scroll-snap-align: start;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  width: 100%;
  min-width: 0;
`;

const IconLogo = styled.img`
  width: 24px;
  height: 21px;
`;

const Detail = styled.div`
  display: block;
  flex: 1 1 auto;
  min-width: 0;

  height: 22px;
  line-height: 22px;
  padding: 3px 8px;
  border: 1px solid #f3efef;
  border-radius: 11px 20px 20px 0;
  background: ${colors.cream};
  font-size: 13px;
  font-weight: 400;
  line-height: 15.6px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
