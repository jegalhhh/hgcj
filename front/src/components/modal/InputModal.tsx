import styled from "styled-components";
import { colors } from "../../styles/colors";
import x_icon from "../../assets/images/icon/x_icon.png";
import { useState } from "react";
import PrimaryButton from "../button/PrimaryButton";
import { useNavigate } from "react-router-dom";
import api, { setAdminSecret } from "../../../axiosConfig";

interface Props {
  onClose: () => void;
}

const InputModal = ({ onClose }: Props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (loading) return;
    const secret = password.trim();
    if (!secret) return alert("관리자 액세스 키를 입력하세요.");

    try {
      setLoading(true);
      await api.get("/admin/donations/pending", {
        headers: { "x-admin-secret": secret },
      });
      setAdminSecret(secret);
      onClose();
      navigate("/donation/admin");
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        (status === 401 || status === 403
          ? "인증 실패: 관리자 키가 올바르지 않습니다."
          : "요청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop onClick={onClose}>
        <Card onClick={(e) => e.stopPropagation()}>
          <BtnRow>
            <CloseBtn type="button" aria-label="닫기" onClick={onClose} />
          </BtnRow>
          <InputField>
            <Title>관리자 인증</Title>
            <Input
              type="password"
              placeholder="관리자 비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </InputField>
          <ConfirmButton
            title={loading ? "확인 중..." : "확인"}
            onClick={handleConfirm}
            disabled={loading || !password.trim()}
          />
        </Card>
      </Backdrop>
    </>
  );
};

export default InputModal;

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
`;

const Card = styled.div`
  background-color: ${colors.cream};
  width: min(100vw, 380px);
  height: auto;
  display: flex;
  flex-direction: column;
  margin: 40px;
  padding: 12px 20px;
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
  font-size: 18px;
  font-weight: 500;
  margin-top: 3.5px;
`;

const InputField = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 12px 16px;
  box-sizing: border-box;

  background-color: ${colors.light_green};
  color: ${colors.gray8};
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  font-size: 15px;

  border-radius: 20px;
  border: none;
  &::placeholder {
    font-size: 13px;
    color: ${colors.gray5};
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: ${colors.green};
  }
`;

const ConfirmButton = styled(PrimaryButton)`
  height: 50px;
`;
