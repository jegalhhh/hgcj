import styled from "styled-components";
import { colors } from "../../../styles/colors";

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
`;

export const Logo = styled.img`
  height: 23.129px;
`;

export const Title = styled.h1`
  font-family: ROKAFSans, Pretendard, sans-serif;
  font-size: 17px;
  font-weight: 500;
  margin: 0;
`;

export const BackButton = styled.img`
  position: absolute;
  left: 0;
  width: 11px;
  cursor: pointer;
`;

export const IconButton = styled.button`
  position: absolute;
  right: 0;
  width: 40px;
  height: 40px;
  background: ${colors.cream};
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    display: block;
    color: ${colors.gray5};
  }
`;
