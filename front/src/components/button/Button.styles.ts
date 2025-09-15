import styled from "styled-components";
import { colors } from "../../styles/colors";

const BaseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const PrimaryWrapper = styled(BaseButton)`
  background-color: ${colors.green};
  border-radius: 20px;
  width: 100%;
  height: 62px;
  padding: 19px 0;

  &:disabled {
    background-color: ${colors.gray3};
  }
`;

export const SecondaryWrapper = styled(BaseButton)`
  background-color: ${colors.cream};
  width: 100%;
  height: 63px;
  border-radius: 42px;

  &:disabled {
    background-color: ${colors.gray2};
  }
`;

export const SelectWrapper = styled(BaseButton)<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) =>
    isSelected ? colors.green : "white"};
  padding: 7px 20px;
  height: 34px;
  border-radius: 60px;
  border: ${({ isSelected }) =>
    isSelected ? "none" : `1px solid ${colors.green}`};
`;

export const ButtonText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.gray8};
`;

export const SelectText = styled.span<{ isSelected?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ isSelected }) => (isSelected ? colors.gray8 : colors.gray5)};
`;

export const IconImage = styled.img<{ size?: number }>`
  width: ${({ size }) => size ?? 20}px;
  height: ${({ size }) => size ?? 20}px;
`;
