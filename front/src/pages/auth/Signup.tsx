import styled from "styled-components";
import Header from "../../components/common/Header/Header";
import signupBack from "../../assets/images/background/login_back.png";
import LabeledInput from "../../components/form/LabeledInput";
import PrimaryButton from "../../components/button/PrimaryButton";
import { useNavigate } from "react-router-dom";
import camera from "../../assets/images/icon/camera.png";
import { colors } from "../../styles/colors";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Background src={signupBack} alt="로그인 배경" />
        <Header
          variant="backWithTitle"
          title="회원가입"
          onBack={() => navigate("/")}
        />
        <FormWrapper>
          <InputWrapper>
            <LabeledInput label="이름" placeholder="이름을 입력하세요." />
            <ImageContainer>
              <LabelText>프로필 이미지</LabelText>
              <ImageUploadBox>
                <UploadIcon src={camera} alt="업로드 아이콘" />
                <Text>이미지</Text>
              </ImageUploadBox>
            </ImageContainer>
            <LabeledInput
              label="비밀번호"
              placeholder="비밀번호를 입력하세요."
            />
            <LabeledInput
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요."
            />
          </InputWrapper>
          <PrimaryButton title="확인" onClick={() => navigate("/donation")} />
        </FormWrapper>
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

const Background = styled.img`
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

const FormWrapper = styled.div`
  z-index: 2;
  width: 100%;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 666px;
`;

const InputWrapper = styled.div``;

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
`;

const UploadIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const Text = styled.span`
  font-size: 11px;
  font-weight: 400;
`;
