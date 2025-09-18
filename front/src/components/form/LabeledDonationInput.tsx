import styled from "styled-components";
import { colors } from "../../styles/colors";
import type { ChangeEvent } from "react";

type LabeledInputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const LabeledDonationInput = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: LabeledInputProps) => {
  return (
    <Field>
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Field>
  );
};

export default LabeledDonationInput;

const Field = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
`;

const Label = styled.label`
  font-size: 17px;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 16px;
  box-sizing: border-box;

  background-color: ${colors.gray1};
  color: ${colors.gray8};
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  font-size: 15px;

  border-radius: 20px;
  border: none;
  &::placeholder {
    font-size: 13px;

    color: ${colors.gray6};
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: ${colors.gray6};
  }
`;
