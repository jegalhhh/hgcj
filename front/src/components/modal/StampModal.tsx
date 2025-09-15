import styled from "styled-components";
import { colors } from "../../styles/colors";
import x_icon from "../../assets/images/icon/x_icon.png";
import stampModal from "../../assets/images/donation/stamp_modal.png";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const StampModal = ({ visible, onClose }: Props) => {
  const stampCount = 3;
  if (!visible) return null;

  return (
    <>
      <Backdrop onClick={onClose}>
        <Card>
          <BtnRow>
            <CloseBtn type="button" aria-label="닫기" onClick={onClose} />
          </BtnRow>
          <Title>새로운 스탬프를 얻었어요!</Title>
          <StampImage src={stampModal} />
          <BoldText>지금까지 총 {stampCount}개를 모았어요</BoldText>
          <DetailText style={{ fontSize: 15, color: colors.gray8 }}>
            마이페이지에서 봉사시간으로 바꿔보세요
          </DetailText>
        </Card>
      </Backdrop>
    </>
  );
};

export default StampModal;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.25);
  padding: 40px;
`;

const Card = styled.div`
  background-color: ${colors.cream};
  width: 100%;
  height: 383px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 20px;
  align-items: center;
`;

const BtnRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const CloseBtn = styled.button`
  width: 24px;
  height: 24px;
  background-color: ${colors.gray8};
  -webkit-mask: url(${x_icon}) no-repeat center / contain;
  mask: url(${x_icon}) no-repeat center / contain;
  border: none;
  cursor: pointer;
`;

const Title = styled.span`
  color: ${colors.gray8};
  font-family: ROKAFSans, Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 500;
  margin-top: 3.5px;
`;

const StampImage = styled.img`
  margin-top: 4px;
  margin-bottom: 4px;
  height: 217px;
`;

const BoldText = styled.span`
  font-size: 17px;
  font-weight: 600;
`;

const DetailText = styled.span`
  color: ${colors.gray6};
  font-size: 15px;
  font-weight: 400;
`;
