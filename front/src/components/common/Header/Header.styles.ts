import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  padding-top: env(safe-area-inset-top, 0);
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
