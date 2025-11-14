"use client";

import type { LabelColorVariant } from "xiilab-ui";
import { Label } from "xiilab-ui";

import type { WorkloadStatusType } from "@/schemas/workload.schema";
import { getWorkloadStatusInfo } from "@/utils/workload/workload.util";

interface WorkloadStatusTextProps {
  status: WorkloadStatusType;
}
/**
 * 워크로드 상태 텍스트
 * @param status - 워크로드 상태
 * @returns 워크로드 상태 텍스트
 */
export function WorkloadStatusText({ status }: WorkloadStatusTextProps) {
  const { label, colorVariant } = getWorkloadStatusInfo(status);

  return <Label variant={colorVariant as LabelColorVariant}>{label}</Label>;
}
