"use client";

import { Label } from "xiilab-ui";

import type { WorkloadStatusResponseWorkloadStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getWorkloadStatusInfoByStatus } from "@/domain/workload/utils/workload.util";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

interface WorkloadStatusTextProps {
  status: WorkloadStatusResponseWorkloadStatus;
}
/**
 * 워크로드 상태 텍스트
 * @param status - 워크로드 상태
 * @returns 워크로드 상태 텍스트
 */
export function WorkloadStatusText({ status }: WorkloadStatusTextProps) {
  const { label, colorVariant } = getWorkloadStatusInfoByStatus(status);

  return (
    <Label
      variant={colorVariant}
      data-testid={WORKLOAD_SELECTOR.status(status.toLowerCase())}
    >
      {label}
    </Label>
  );
}
