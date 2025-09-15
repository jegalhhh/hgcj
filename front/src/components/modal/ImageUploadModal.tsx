import { useState } from "react";
import { useImagePicker } from "../../hooks/useImagePicker";
import fileIcon from "../../assets/images/icon/file.png";
import uploadIcon from "../../assets/images/icon/upload.png";
import cameraIcon from "../../assets/images/icon/camera_fill.png";
import styled from "styled-components";
import { colors } from "../../styles/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  onImageSelect: (file: File) => void;
}

const ImageUploadModal = ({ visible, onClose, onImageSelect }: Props) => {
  const { pickImages, pickFiles, takePhoto } = useImagePicker();
  const [isBusy, setIsBusy] = useState(false);

  if (!visible) return null;

  const safeClose = () => {
    if (!isBusy) onClose();
  };

  const handlePickFile = async () => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const files = await pickFiles({ multiple: false });
      const file = files?.[0];
      if (file) onImageSelect(file);
    } catch (e) {
      console.error("파일 선택 중 오류:", e);
    } finally {
      setIsBusy(false);
      safeClose();
    }
  };

  const handleUploadPhoto = async () => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const files = await pickImages(false);
      const file = files?.[0];
      if (file) onImageSelect(file);
    } catch (e) {
      console.error("사진 업로드 중 오류:", e);
    } finally {
      setIsBusy(false);
      safeClose();
    }
  };

  const handleTakePhoto = async () => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const file = await takePhoto();
      if (file) onImageSelect(file);
    } catch (e) {
      console.error("촬영 중 오류:", e);
    } finally {
      setIsBusy(false);
      safeClose();
    }
  };

  return (
    <BackDrop onClick={safeClose}>
      <ModalView
        role="dialog"
        aria-modal="true"
        aria-labelledby="imageUploadTitle"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalItem onClick={handlePickFile} aria-disabled={isBusy}>
          <FileImage src={fileIcon} alt="파일 선택" />
          <ModalText>파일 선택</ModalText>
        </ModalItem>

        <ModalItem onClick={handleUploadPhoto} aria-disabled={isBusy}>
          <UploadImage src={uploadIcon} alt="사진 업로드" />
          <ModalText>사진 업로드</ModalText>
        </ModalItem>

        <ModalItem onClick={handleTakePhoto} aria-disabled={isBusy}>
          <CameraImage src={cameraIcon} alt="사진 찍기" />
          <ModalText>사진 찍기</ModalText>
        </ModalItem>
      </ModalView>
    </BackDrop>
  );
};

export default ImageUploadModal;

const BackDrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.25);
`;

const ModalView = styled.div`
  background-color: ${colors.cream};
  width: 100%;
  height: 211px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 48px 52px calc(39px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 64px;
`;

const ModalItem = styled.button`
  all: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  &:disabled,
  &[aria-disabled="true"] {
    pointer-events: none;
    opacity: 0.6;
    cursor: default;
  }
`;

const ModalText = styled.span`
  color: ${colors.gray7};
  font-size: 15px;
  font-weight: 400;
`;

const FileImage = styled.img`
  width: 47px;
  height: 37px;
`;

const UploadImage = styled.img`
  width: 36.36px;
  height: 41px;
`;

const CameraImage = styled.img`
  width: 46.52px;
  height: 41px;
`;
