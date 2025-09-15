import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import { useNavigate } from "react-router-dom";
import DonationGuideBox from "../../components/ui/DonationGuideBox";
import LabeledDonationInput from "../../components/form/LabeledDonationInput";
import uploadIcon from "../../assets/images/icon/share.png";
import { colors } from "../../styles/colors";
import PrimaryButton from "../../components/button/PrimaryButton";
import { useState } from "react";
import ImageUploadModal from "../../components/modal/ImageUploadModal";
import StampModal from "../../components/modal/StampModal";

const DonationCertify = () => {
  const navigate = useNavigate();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [stampModalVisible, setStampModalVisible] = useState(false);
  return (
    <>
      <Container>
        <Header
          variant="backWithTitle"
          title="기부 인증하기"
          onBack={() => navigate("/donation")}
        />

        <DonationGuideBox />
        <FormSection>
          <div>
            <UploadImageForm
              onClick={() => setUploadModalVisible(true)}
              aria-disabled={!uploadedImage}
            >
              <Label>1. 기부 이미지를 업로드 해주세요.</Label>
              <UploadButton>
                <UploadIcon src={uploadIcon} alt="사진 올리기" />
                <UploadText>사진 올리기</UploadText>
              </UploadButton>
              {uploadedImage && (
                <>
                  <Preview>
                    <PreviewImg src={uploadedImage} alt="업로드 미리보기" />
                  </Preview>
                  <SmallButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        if (uploadedImage.startsWith("blob:")) {
                          URL.revokeObjectURL(uploadedImage);
                        }
                      } catch {}
                      setUploadedImage(null);
                      setUploadModalVisible(true);
                    }}
                  >
                    다시 선택
                  </SmallButton>
                </>
              )}
            </UploadImageForm>
            <LabeledDonationInput
              label="2. 기부 물품을 입력해주세요."
              placeholder="기부 물품을 입력해주세요"
            />
            <LabeledDonationInput
              label="3. 물품 개수를 입력해주세요."
              placeholder="기부 개수를 입력해주세요"
            />
          </div>
          <ImageUploadModal
            visible={uploadModalVisible}
            onClose={() => setUploadModalVisible(false)}
            onImageSelect={(uri) => {
              setUploadedImage(uri);
              setUploadModalVisible(false);
            }}
          />
          <PrimaryButton
            title="확인"
            onClick={() => setStampModalVisible(true)}
          />
          <StampModal
            visible={stampModalVisible}
            onClose={() => setStampModalVisible(false)}
          />
        </FormSection>
      </Container>
    </>
  );
};

export default DonationCertify;

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

const FormSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  margin-top: 28px;
`;

const UploadImageForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
`;

const Label = styled.span`
  font-size: 17px;
  font-weight: 600;
`;

const UploadButton = styled.div`
  width: 132px;
  height: 48px;
  background: ${colors.gray1};
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 23px;
  gap: 10px;
  box-sizing: border-box;
`;

const UploadIcon = styled.img`
  width: 15px;
  height: 15px;
`;

const UploadText = styled.span`
  font-size: 13px;
  font-weight: 400;
  line-height: 15.6px;
`;

const Preview = styled.div`
  margin-top: 12px;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  background: ${colors.gray1};
  border: 1px solid ${colors.gray2};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SmallButton = styled.button`
  width: 100px;
  appearance: none;
  border: 1px solid ${colors.green};
  background: ${colors.cream};
  color: ${colors.gray8};
  font-size: 12px;

  padding: 4px 8px;
  border-radius: 999px;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;
