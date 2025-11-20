"use client";

import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

import { CirclePlusIcon } from "../icon/circle-plus-icon";

interface CreateModelButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼에 표시될 텍스트 */
  title: string;
}

/**
 * 재사용 가능한 모델 생성 버튼 컴포넌트
 */
export function CreateModelButton({ title, ...props }: CreateModelButtonProps) {
  return (
    <Container type="button" {...props}>
      <CirclePlusIcon />
      {title}
    </Container>
  );
}

const Container = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #666666;

  --icon-fill: #666666;

  &.dark {
    --icon-fill: #a3afd0;
    color: #a3afd0;
  }
`;
