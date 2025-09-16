import styled from "styled-components";
import o_icon from "../../assets/images/icon/o_icon.png";
import x_icon from "../../assets/images/icon/x_icon.png";
import { colors } from "../../styles/colors";

const DonationGuideBox = () => {
  return (
    <>
      <BoxView>
        <BoxContent>
          <IconRow>
            <IconBox>
              <OIcon src={o_icon} />
            </IconBox>
            <BoldText>공유 가능한 음식</BoldText>
          </IconRow>
          <SemiboldText>유통기한이 3일 이상 남은 음식</SemiboldText>
          <Content>
            <Divider />
            <DetailText>
              채소, 식재료, 과일, 반찬류, 통조림 등 가공품, 반조리식품,
              <br />
              냉동식품, 음료수, 빵, 떡, 간식류, 곡류, 음식적 상품권(쿠폰) 등
            </DetailText>
          </Content>
        </BoxContent>
        <BoxContent>
          <IconRow>
            <IconBox>
              <XIcon src={x_icon} />
            </IconBox>
            <BoldText>공유 불가능한 음식</BoldText>
          </IconRow>
          <Content>
            <Divider />
            <RedText>
              유통기한이 지난 음식물,
              <br />
              주류, 약품류, 건강보조식품, 불량식품 등
            </RedText>
          </Content>
        </BoxContent>
      </BoxView>
    </>
  );
};

export default DonationGuideBox;

const BoxView = styled.div`
  width: 100%;
  background-color: rgba(255, 229, 226, 0.56);
  border-radius: 20px;
  padding: 19px 20px;
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const BoxContent = styled.div``;

const IconRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7.59px;
`;

const IconBox = styled.div`
  width: 16.414px;
  height: 16.414px;
  background-color: ${colors.red};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OIcon = styled.img`
  width: 10px;
  height: 10px;
`;

const XIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const BoldText = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const SemiboldText = styled.span`
  font-size: 15px;
  font-weight: 400;
  display: flex;
  margin-top: 8px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7.34px;
  margin-top: 8px;
`;

const Divider = styled.div`
  width: 1px;
  height: 35px;
  background-color: ${colors.gray6};
`;

const DetailText = styled.span`
  font-size: 13px;
  font-weight: 400;
  line-height: 15.6px;
  color: ${colors.gray6};
`;

const RedText = styled.span`
  font-size: 13px;
  font-weight: 400;
  line-height: 15.6px;
  color: ${colors.red};
`;
