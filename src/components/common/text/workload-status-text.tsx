"use client";

import type { LabelColorVariant } from "xiilab-ui";
import { Label } from "xiilab-ui";

import { Workload } from "@/models/workload.model";
import type { WorkloadStatusType } from "@/schemas/workload.schema";

interface WorkloadStatusTextProps {
  // 워크로드 상태
  status: WorkloadStatusType;
}
// 워크로드 상태 텍스트
export function WorkloadStatusText({ status }: WorkloadStatusTextProps) {
  const { displayName, colorVariant } = Workload.getStatusInfo(status);

  return (
    <Label variant={colorVariant as LabelColorVariant}>{displayName}</Label>
  );
}
