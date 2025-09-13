import styled from "styled-components";
import { colors } from "../../styles/colors";

type LabeledInputProps = {
  label: string;
  placeholder?: string;
};

const LabeledInput = ({ label, placeholder, ...props }: LabeledInputProps) => {
  return (
    <Field>
      <Label>{label}</Label>
      <Input placeholder={placeholder} {...props} />
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

  background-color: #fff;
  color: ${colors.gray8};
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  font-size: 13px;

  border-radius: 20px;
  border: none;
  &::placeholder {
    color: ${colors.gray5};
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: ${colors.green};
  }
`;
