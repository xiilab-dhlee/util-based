import type { DropdownOption } from "xiilab-ui";

import type { WorkloadJobType } from "@/domain/workload/schemas/workload.schema";

export const WORKLOAD_IMAGE_TYPES = [
  "HUB",
  "BUILTIN",
  "INTERNAL_REGISTRY",
  "EXTERNAL_REGISTRY",
] as const;

/**
 * 워크로드 잡 타입 라벨 상수
 */
export const WORKLOAD_JOB_TYPE_LABEL_MAP: Record<WorkloadJobType, string> = {
  BATCH: "Batch",
  INTERACTIVE: "Interactive",
  DISTRIBUTED: "Distributed",
} as const;

/**
 * 워크로드 잡 타입별 색상 상수
 */
export const WORKLOAD_JOB_TYPE_COLOR_MAP: Record<WorkloadJobType, string> = {
  BATCH: "#2E3452",
  INTERACTIVE: "#2D64DC",
  DISTRIBUTED: "#3FC85B",
} as const;

/**
 * 워크로드 잡 타입 드롭다운 옵션
 */
export const WORKLOAD_JOB_OPTIONS: DropdownOption[] = (
  Object.entries(WORKLOAD_JOB_TYPE_LABEL_MAP) as [WorkloadJobType, string][]
).map(([value, label]) => ({
  label,
  value,
}));

export const WORKLOAD_STATUS_OPTIONS: DropdownOption[] = [
  {
    label: "실행중",
    value: "RUNNING",
  },
  {
    label: "대기중",
    value: "PENDING",
  },
  {
    label: "에러",
    value: "ERROR",
  },
  {
    label: "종료",
    value: "COMPLETED",
  },
];

/**
 * 잡 타입에 따른 라벨 반환 (워크로드 공용)
 */
export function getJobTypeLabel(jobType: WorkloadJobType): string;
export function getJobTypeLabel(jobType: string): string;
export function getJobTypeLabel(jobType: string): string {
  const label = WORKLOAD_JOB_TYPE_LABEL_MAP[jobType as WorkloadJobType];

  if (label) {
    return label;
  }

  return jobType;
}
