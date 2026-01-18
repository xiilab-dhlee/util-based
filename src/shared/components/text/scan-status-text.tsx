"use client";

import { Label } from "xiilab-ui";

/** 스캔 상태 타입 */
type ScanStatus = "COMPLETED" | "FAILED" | "IN_PROGRESS";

/** 스캔 상태 텍스트 매핑 */
const SCAN_STATUS_TEXT: Record<ScanStatus, string> = {
  COMPLETED: "완료",
  FAILED: "실패",
  IN_PROGRESS: "진행중",
};

/** 스캔 상태 Label variant 매핑 */
const SCAN_STATUS_VARIANT: Record<ScanStatus, "blue" | "red" | "green"> = {
  COMPLETED: "blue",
  FAILED: "red",
  IN_PROGRESS: "green",
};

interface ScanStatusTextProps {
  status?: ScanStatus | string | null;
}

/**
 * 스캔 상태 텍스트 컴포넌트
 */
export function ScanStatusText({ status }: ScanStatusTextProps) {
  if (!status) {
    return <span>-</span>;
  }

  const text = SCAN_STATUS_TEXT[status as ScanStatus];
  const variant = SCAN_STATUS_VARIANT[status as ScanStatus];

  if (!text || !variant) {
    return <span>-</span>;
  }

  return <Label variant={variant}>{text}</Label>;
}
