import styled from "styled-components";
import { colors } from "../../../styles/colors";

export const TabWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;

  width: min(100vw, 420px);

  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 100px;
  height: calc(85x + constant(safe-area-inset-bottom));
  height: calc(85px + env(safe-area-inset-bottom, 0));
  padding: 12px 56px 0;
  box-sizing: border-box;

  background: ${colors.green};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const TabButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 36px;
  height: 54px;
  cursor: pointer;
  background: transparent;
  border: none;
`;

export const Icon = styled.div<{ $active?: boolean }>`
  display: flex;
  width: 33px;
  height: 33px;
  align-items: center;
  justify-content: center;
  filter: ${({ $active }) => ($active ? colors.gray8 : "none")};
`;

export const Label = styled.span<{ $active?: boolean }>`
  font-size: 13px;
  font-weight: 400;
  line-height: 15.6px;
  color: ${({ $active }) => ($active ? colors.gray8 : "#73a351")};
`;
