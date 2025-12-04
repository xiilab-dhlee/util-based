/**
 * 워크로드 잡 타입 라벨 상수
 */
export const WORKLOAD_JOB_TYPE_LABEL_MAP = {
  BATCH: "Batch",
  INTERACTIVE: "Interactive",
  DISTRIBUTED: "Distributed",
} as const;

export type WorkloadJobType = keyof typeof WORKLOAD_JOB_TYPE_LABEL_MAP;

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
