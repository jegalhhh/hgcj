import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import background from "../../assets/images/background/back_green.png";
import LabeledInput from "../../components/form/LabeledInput";
import PrimaryButton from "../../components/button/PrimaryButton";
import { useNavigate } from "react-router-dom";
import camera from "../../assets/images/icon/camera.png";
import { colors } from "../../styles/colors";
import { useImagePicker } from "../../hooks/useImagePicker";
import React, { useEffect, useState } from "react";
import api from "../../../axiosConfig";

type RegisterResponse = {
  id: number;
  name: string;
  profile_image_url: string;
};

const Signup = () => {
  const navigate = useNavigate();
  const { pickImages } = useImagePicker();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const files = await pickImages(false, 1);
    if (files.length > 0) {
      const file = files[0];
      if (profilePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
      setProfileImageFile(file);
      setProfilePreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (profilePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
    };
  }, [profilePreviewUrl]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!name || name.trim().length < 2) {
      alert("이름을 2글자 이상 입력해 주세요.");
      return;
    }
    if (!password || password.length < 6) {
      alert("비밀번호를 6글자 이상 입력해 주세요.");
      return;
    }
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post<RegisterResponse>("/auth/register", {
        name,
        password,
      });
      alert("회원가입 성공!");
      navigate("/");
    } catch (err: any) {
      console.error("회원가입 에러:", err.response?.data);
      const status = err?.response?.status;
      if (status === 422) {
        alert("입력값이 올바르지 않습니다.");
      } else {
        alert("회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <BackgroundImage src={background} alt="회원가입 배경" />
        <Header
          variant="backWithTitle"
          title="회원가입"
          onBack={() => navigate("/")}
        />
        <FormSection as="form" onSubmit={handleSubmit}>
          <div>
            <LabeledInput
              label="이름"
              placeholder="이름을 입력하세요. (2글자 이상)"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />

            <ImageContainer>
              <LabelText>프로필 이미지</LabelText>
              <ImageUploadBox onClick={handlePickImage}>
                {profilePreviewUrl ? (
                  <PreviewImage src={profilePreviewUrl} alt="프로필 미리보기" />
                ) : (
                  <>
                    <UploadIcon src={camera} alt="업로드 아이콘" />
                    <Text>이미지</Text>
                  </>
                )}
              </ImageUploadBox>
            </ImageContainer>

            <LabeledInput
              label="비밀번호"
              placeholder="비밀번호를 입력하세요. (6글자 이상)"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <LabeledInput
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요."
              type="password"
              value={passwordCheck}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPasswordCheck(e.target.value)
              }
            />
          </div>

          <PrimaryButton
            title={loading ? "회원가입 중..." : "확인"}
            onClick={() => handleSubmit()}
            disabled={loading}
          />
        </FormSection>
      </Container>
    </>
  );
};

export default Signup;

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

const BackgroundImage = styled.img`
  position: absolute;
  bottom: calc(-1 * var(--padBottom, 44px));
  left: calc(-1 * var(--gutter, 24px));
  width: calc(100% + (var(--gutter, 24px) * 2));
  height: calc(
    var(--padBottom, 44px) + max(730px, calc(min(100vw, 420px) * 774 / 448.62))
  );
  max-width: none;
  object-fit: cover;
  object-position: top;
  z-index: 0;
`;

const FormSection = styled.div`
  z-index: 2;
  width: 100%;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 666px;
`;

const ImageContainer = styled.div`
  background: #fff;
  width: 100%;
  height: 153px;
  padding: 18px 20px;
  margin-bottom: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
`;

const LabelText = styled.span`
  font-size: 15px;
`;

const ImageUploadBox = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 20px;
  border: 1px solid ${colors.green};
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const Text = styled.span`
  font-size: 11px;
  font-weight: 400;
`;
