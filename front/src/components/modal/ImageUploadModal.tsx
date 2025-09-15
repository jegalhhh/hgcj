import { useImagePicker } from "../../hooks/useImagePicker";
import file from "../../assets/images/icon/file.png";
import upload from "../../assets/images/icon/upload.png";
import camera from "../../assets/images/icon/camera_fill.png";
import styled from "styled-components";
import { colors } from "../../styles/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  onImageSelect: (uri: string) => void;
}

const ImageUploadModal = ({ visible, onClose, onImageSelect }: Props) => {
  const { pickImages, pickFiles, takePhoto } = useImagePicker();
  if (!visible) return null;

  const onPickFile = async () => {
    const urls = await pickFiles({ multiple: false });
    if (urls.length > 0) {
      onImageSelect(urls[0]);
    }
    onClose();
  };

  const onUploadPhoto = async () => {
    const urls = await pickImages(false);
    if (urls.length) onImageSelect(urls[0]);
    onClose();
  };

  const onTakePhoto = async () => {
    const url = await takePhoto();
    if (url) {
      onImageSelect(url);
    }
    onClose();
  };

  return (
    <>
      <BackDrop onClick={onClose}>
        <ModalView
          role="dialog"
          aria-modal="true"
          aria-labelledby="imageUploadTitle"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalItem onClick={onPickFile}>
            <FileImage src={file} alt="파일 선택" />
            <ModalText>파일 선택</ModalText>
          </ModalItem>
          <ModalItem onClick={onUploadPhoto}>
            <UploadImage src={upload} alt="사진 업로드" />
            <ModalText>사진 업로드</ModalText>
          </ModalItem>
          <ModalItem onClick={onTakePhoto}>
            <CameraImage src={camera} alt="사진 찍기" />
            <ModalText>사진 찍기</ModalText>
          </ModalItem>
        </ModalView>
      </BackDrop>
    </>
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

const ModalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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
