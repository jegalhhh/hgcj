import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { subscribeGlobalLoading } from "../../hooks/loadingBus";
import { colors } from "../../styles/colors";

export default function GlobalLoading() {
  const [busy, setBusy] = useState(false);
  useEffect(() => subscribeGlobalLoading(setBusy), []);
  if (!busy) return null;

  return (
    <Overlay role="progressbar" aria-busy="true">
      <Spinner />
      <Msg>로딩 중…</Msg>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 4000;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(2px);
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  pointer-events: all;
`;

const spin = keyframes`to{ transform: rotate(360deg); }`;

const Spinner = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid ${colors.gray3};
  border-top-color: ${colors.green};
  animation: ${spin} 0.8s linear infinite;
`;

const Msg = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.gray8};
`;
