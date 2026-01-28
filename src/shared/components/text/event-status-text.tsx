"use client";

import styled from "styled-components";
import { Label } from "xiilab-ui";

import type { BaseResponseWorkloadEventHistoryResponseStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

// status와 텍스트, color를 한 번에 관리
const statusMap = {
  SUCCESS: { text: "Success", variant: "green" },
  FAIL: { text: "Fail", variant: "orange" },
  ERROR: { text: "Error", variant: "red" },
} as const;

interface EventStatusTextProps {
  status: BaseResponseWorkloadEventHistoryResponseStatus;
}

/**
 * 이벤트 이력 상태 텍스트
 * @param status - 이벤트 상태 (SUCCESS | FAIL | ERROR)
 * @returns 이벤트 상태 라벨
 */
export function EventStatusText({ status }: EventStatusTextProps) {
  const { text, variant } = statusMap[status] || statusMap.ERROR;

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
