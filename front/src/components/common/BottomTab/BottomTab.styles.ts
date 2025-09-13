import styled from "styled-components";
import { colors } from "../../../styles/colors";

export const TabWrapper = styled.nav`
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;

    display: flex;
    align-items: center;
    justify-items: center;
    gap: 100px;
    height: 64px;
    padding: 0 calc(8px + env(safe-area-inset-bottom, 0));

    background: ${colors.green};
    border-top-left-radius: 20px,
    border-top-right-radius: 20px,
    width: 100%;
`;

export const TabButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: auto;
  cursor: pointer;
`;

export const Icon = styled.img`
  width: 33px;
  height: 33px;
`;

export const Label = styled.span`
  font-size: 13px;
  font-weight: 400;
  line-height: 1.2;
`;
