import type { SelectProps } from "antd";
import { Select } from "antd";
import styled from "styled-components";

import { MyIcon } from "@/components/common/icon";

interface MyMultipleSelectProps extends SelectProps {}

export function MyMultipleSelect({ ...props }: MyMultipleSelectProps) {
  return (
    <StyledSelect
      mode="multiple"
      suffixIcon={
        <IconWrapper>
          <MyIcon name="Dropdown" color="var(--icon-fill)" size={18} />
        </IconWrapper>
      }
      {...props}
    />
  );
}

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  border-radius: 2px;
  transition: transform 0.2s ease;

  --icon-fill: #000;
`;

const StyledSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    border-color: var(--color-gray-09) !important;
    border-radius: 2px !important;
    background-color: var(--color-gray-13) !important;

    &:hover {
      border-color: var(--color-blue-09) !important;
    }
  }

  &.ant-select-focused .ant-select-selector {
    border-color: var(--color-blue-09) !important;
    box-shadow: none !important;
  }

  &.ant-select-open ${IconWrapper} {
    transform: rotate(180deg);
  }

  & .ant-select-selection-item {
    background-color: #ffffff !important;
    border: 1px solid #e0e0e0 !important;
  }

  & .ant-select-selection-item-content {
    font-weight: 400 !important;
    font-size: 11px !important;
    color: #2b2b2b !important;
    /* margin-inline-end: 2px !important; */
  }

  & .ant-select-selection-item svg {
    fill: #5f6368 !important;
  }
`;
