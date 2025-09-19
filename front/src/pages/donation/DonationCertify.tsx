import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import { useNavigate } from "react-router-dom";
import DonationGuideBox from "../../components/ui/DonationGuideBox";
import LabeledDonationInput from "../../components/form/LabeledDonationInput";
import uploadIcon from "../../assets/images/icon/share.png";
import { colors } from "../../styles/colors";
import PrimaryButton from "../../components/button/PrimaryButton";
import React, { useState } from "react";
import ImageUploadModal from "../../components/modal/ImageUploadModal";
import StampModal from "../../components/modal/StampModal";
import api from "../../../axiosConfig";

const DonationCertify = () => {
  const navigate = useNavigate();

  /*   const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("ACCESS_TOKEN"))
  ); */

  /*   useEffect(() => {
    const onStorage = () =>
      setIsLoggedIn(Boolean(localStorage.getItem("ACCESS_TOKEN")));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []); */

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  // const [guestNickname, setGuestNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [stampModalVisible, setStampModalVisible] = useState(false);
  const [modalInitialCount, setModalInitialCount] = useState<
    number | undefined
  >(undefined);

  const handleSubmit = async () => {
    if (!itemName.trim()) {
      alert("기부 물품을 입력해 주세요.");
      return;
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      alert("개수는 1 이상의 정수로 입력해 주세요.");
      return;
    }
    if (!uploadedImage) {
      alert("이미지를 업로드해 주세요.");
      return;
    }
    /*
    if (!isLoggedIn && !guestNickname.trim()) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
      */

    const formData = new FormData();
    formData.append("item_name", itemName);
    formData.append("quantity", quantity);
    formData.append("image", uploadedImage);

    /*
    비회원용 닉네임 설정 - 서버 로직 수정 필요
    if (!isLoggedIn) {
      formData.append("nickname", guestNickname.trim());
    }
      */
    try {
      setLoading(true);
      const { data } = await api.post("/donations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      try {
        const { data: counts } = await api.get<{
          total_donations: number;
          verified_donations: number;
        }>("/donations/me/stamps");
        const optimistic = Number(counts?.verified_donations ?? 0) + 1;
        setModalInitialCount(optimistic);
      } catch {
        setModalInitialCount(undefined);
      }

      console.log("기부 등록 성공:", data);
      setStampModalVisible(true);
    } catch (err: any) {
      console.error("기부 등록 실패:", err.response?.data || err);
      alert("기부 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header
        variant="backWithTitle"
        title="기부 인증하기"
        onBack={() => navigate("/donation")}
      />

      <DonationGuideBox />
      <FormSection>
        <div>
          {/*!isLoggedIn && (
            <LabeledDonationInput
            label="0. 닉네임을 입력해주세요."
            placeholder="닉네임을 입력해주세요."
            value={guestNickname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setGuestNickname(e.target.value)
            }
            />
          )*/}
          <UploadImageForm onClick={() => setUploadModalVisible(true)}>
            <Label>1. 기부 이미지를 업로드 해주세요.</Label>
            <UploadButton>
              <UploadIcon src={uploadIcon} alt="사진 올리기" />
              <UploadText>사진 올리기</UploadText>
            </UploadButton>

            {previewUrl && (
              <>
                <Preview>
                  <PreviewImg src={previewUrl} alt="업로드 미리보기" />
                </Preview>
                <SmallButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (previewUrl.startsWith("blob:")) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(null);
                    setUploadedImage(null);
                    setUploadModalVisible(false);
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
            value={itemName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setItemName(e.target.value)
            }
          />
          <LabeledDonationInput
            label="3. 물품 개수를 입력해주세요."
            placeholder="기부 개수를 입력해주세요"
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuantity(e.target.value)
            }
          />
        </div>

        <ImageUploadModal
          visible={uploadModalVisible}
          onClose={() => setUploadModalVisible(false)}
          onImageSelect={(file) => {
            setUploadedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setUploadModalVisible(false);
          }}
        />

        <PrimaryButton
          title={loading ? "등록 중..." : "확인"}
          onClick={handleSubmit}
          disabled={loading}
        />

        <StampModal
          visible={stampModalVisible}
          initialCount={modalInitialCount}
          onClose={() => {
            navigate("/donation");
            setStampModalVisible(false);
          }}
        />
      </FormSection>
    </Container>
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
