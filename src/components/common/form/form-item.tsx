"use client";

import type { HTMLAttributes, PropsWithChildren } from "react";
import styled from "styled-components";

interface FormItemProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * 폼 아이템
 * @param children 아이템 내용
 * @returns 아이템 컴포넌트
 */
export function FormItem({ children, ...props }: PropsWithChildren<FormItemProps>) {
  return <Container {...props}>{children}</Container>;
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  flex: 1;

  &.last {
    padding-bottom: 0;
  }
`;
