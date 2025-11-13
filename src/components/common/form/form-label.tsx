"use client";
import type { LabelHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

import { requiredTextStyle } from "@/styles/mixins/text";

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  rightChildren?: ReactNode;
}

/**
 * 폼 라벨
 * @param children 라벨 내용
 * @param rightChildren 라벨 오른쪽 요소
 * @param props 라벨 속성
 * @returns 라벨 컴포넌트
 */
export function FormLabel({
  children,
  rightChildren,
  ...props
}: PropsWithChildren<FormLabelProps>) {
  return (
    <Container>
      <Label {...props}>{children}</Label>
      {rightChildren}
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 16px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;

  ${requiredTextStyle}
`;
