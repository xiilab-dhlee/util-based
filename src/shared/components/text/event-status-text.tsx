"use client";
import classNames from "classnames";
import styled from "styled-components";

import { statusTextStyle } from "@/styles/mixins/text";

// status와 텍스트, color를 한 번에 관리
const statusMap = {
  warning: { text: "Warning", color: "red" },
  normal: { text: "Normal", color: "green" },
} as const;

interface EventStatusTextProps {
  // 상태
  status: "warning" | "normal";
}
// 이벤트 이력 상태 텍스트
export function EventStatusText({ status }: EventStatusTextProps) {
  const { text, color } = statusMap[status] || { text: status, color: "gray" };
  return <Container className={classNames(color)}>{text}</Container>;
}

const Container = styled.span`
  ${statusTextStyle()}

  font-weight: 400;
`;
