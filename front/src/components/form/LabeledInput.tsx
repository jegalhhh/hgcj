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

const LabeledInput = ({
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

export default LabeledInput;

const Field = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const Label = styled.label`
  font-size: 15px;
`;

const Input = styled.input`
  width: 100%;
  height: 55px;
  padding: 12px 16px;
  box-sizing: border-box;

  background-color: ${colors.cream};
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
