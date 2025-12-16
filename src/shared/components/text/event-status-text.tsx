"use client";

import styled from "styled-components";
import { Label } from "xiilab-ui";

// status와 텍스트, color를 한 번에 관리
const statusMap = {
  warning: { text: "Warning", variant: "red" },
  normal: { text: "Normal", variant: "green" },
} as const;

interface EventStatusTextProps {
  status: "warning" | "normal";
}

/**
 * 이벤트 이력 상태 텍스트
 * @param status - 이벤트 상태 (warning | normal)
 * @returns 이벤트 상태 라벨
 */
export function EventStatusText({ status }: EventStatusTextProps) {
  const { text, variant } = statusMap[status];

  return (
    <Container>
      <Label variant={variant}>{text}</Label>
    </Container>
  );
}

const Container = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
