"use client";

import classNames from "classnames";
import { useSetAtom } from "jotai";
import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import type { WorkloadImageType } from "../../schemas/workload.schema";
import { imageIdAtom, imageTagIdAtom } from "../../state/create-workload.atom";
import { getWorkloadImageTypeInfo } from "../../utils/workload.util";

interface CreateWorkloadImageButtonProps {
  type: WorkloadImageType;
  setType: Dispatch<SetStateAction<WorkloadImageType>>;
  isSelected: boolean;
  disabled?: boolean;
}

export function CreateWorkloadImageButton({
  type,
  setType,
  isSelected,
  disabled,
}: CreateWorkloadImageButtonProps) {
  const setImageId = useSetAtom(imageIdAtom);
  const setImageTagId = useSetAtom(imageTagIdAtom);

  const { label, icon } = getWorkloadImageTypeInfo(type);

  const handleClick = () => {
    setType(type);
    setImageId(null);
    setImageTagId(null);
  };

  return (
    <Container
      type="button"
      className={classNames({ active: isSelected })}
      onClick={handleClick}
      disabled={disabled}
    >
      <Icon name={icon} size={16} active={isSelected} />
      <Typography.Text
        variant="body-2-1"
        color={isSelected ? "#00144B" : "#000"}
      >
        {label}
      </Typography.Text>
    </Container>
  );
}

const Container = styled.button`
  flex: 1;
  /* Component styles */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 8px 12px;
  border-radius: 2px;
  border: 1px solid #B9BEC3;
  background-color: #fafafa;
  cursor: pointer;
  white-space: nowrap;

  &:not(:disabled):hover {
    border-color: #3d3fdf;
  }

  &.active {
    border-color: #3d3fdf;
    outline: 1px solid #366BFF1A;
  }

  &:disabled {
    background-color: var(--color-gray-11);
    border-color: var(--color-gray-09);
    cursor: not-allowed;
  }

`;
