import type { PropsWithChildren } from "react";
import styled from "styled-components";

/**
 * 폼 로우
 * @param children 로우 내용
 * @returns 로우 컴포넌트
 */
export function FormRow({ children }: PropsWithChildren) {
  return <Container>{children}</Container>;
}


const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden;
`;
