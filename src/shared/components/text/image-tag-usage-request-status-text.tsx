"use client";

import type { LabelColorVariant } from "xiilab-ui";
import { Label } from "xiilab-ui";

import type { ImageTagUsageRequestResponseApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

interface ImageTagUsageRequestStatusTextProps {
  status: ImageTagUsageRequestResponseApprovalStatus;
}

const STATUS_INFO: Record<
  ImageTagUsageRequestResponseApprovalStatus,
  { text: string; color: LabelColorVariant }
> = {
  APPROVAL_WAITING: { text: "대기", color: "blue" },
  APPROVED: { text: "승인", color: "green" },
  REJECTED: { text: "반려", color: "red" },
};

export function ImageTagUsageRequestStatusText({
  status,
}: ImageTagUsageRequestStatusTextProps) {
  const { text, color } = STATUS_INFO[status] || {
    text: "알 수 없음",
    color: "gray" as LabelColorVariant,
  };

  return <Label variant={color}>{text}</Label>;
}
