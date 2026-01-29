"use client";

import type { LabelColorVariant } from "xiilab-ui";
import { Label } from "xiilab-ui";

import { ImageTagListResponseScanStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

type ScanStatus = ImageTagListResponseScanStatus;

/** 스캔 상태 텍스트 매핑 */
const SCAN_STATUS_TEXT: Record<ScanStatus, string> = {
  [ImageTagListResponseScanStatus.SUCCESS]: "완료",
  [ImageTagListResponseScanStatus.PENDING]: "대기중",
  [ImageTagListResponseScanStatus.RUNNING]: "진행중",
  [ImageTagListResponseScanStatus.STOPPED]: "중지됨",
  [ImageTagListResponseScanStatus.ERROR]: "실패",
  [ImageTagListResponseScanStatus.NOT_SCANNED]: "검사 미실시",
  [ImageTagListResponseScanStatus.UNSUPPORTED]: "지원안함",
  [ImageTagListResponseScanStatus.UNKNOWN]: "알 수 없음",
};

/** 스캔 상태 Label variant 매핑 */
const SCAN_STATUS_VARIANT: Record<ScanStatus, LabelColorVariant> = {
  [ImageTagListResponseScanStatus.SUCCESS]: "blue",
  [ImageTagListResponseScanStatus.PENDING]: "orange",
  [ImageTagListResponseScanStatus.RUNNING]: "green",
  [ImageTagListResponseScanStatus.STOPPED]: "black",
  [ImageTagListResponseScanStatus.ERROR]: "red",
  [ImageTagListResponseScanStatus.NOT_SCANNED]: "black",
  [ImageTagListResponseScanStatus.UNSUPPORTED]: "black",
  [ImageTagListResponseScanStatus.UNKNOWN]: "black",
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
