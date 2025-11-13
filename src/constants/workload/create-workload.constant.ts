import type { StepItem } from "xiilab-ui";

/**
 * Job Type 상수
 */
export const JOB_TYPES = {
  BATCH: "batch",
  INTERACTIVE: "interactive",
} as const;

/**
 * Job Type 타입
 */
export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

/**
 * Job Type 레이블 매핑
 */
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  [JOB_TYPES.BATCH]: "Batch",
  [JOB_TYPES.INTERACTIVE]: "Interactive",
};

/**
 * 워크로드 생성 단계 타입 정의
 */
export type CreateWorkloadStep =
  | "job-type-meta" // Step 1: Job Type & Meta Data
  | "resource" // Step 2: Resource
  | "task" // Step 3: Task
  | "command"; // Step 4: Command

/**
 * 워크로드 생성 단계 정보
 */
export const CREATE_WORKLOAD_STEP_ITEMS: StepItem[] = [
  {
    number: "01",
    description: "Job Type & Meta Data",
  },
  {
    number: "02",
    description: "Resource",
  },
  {
    number: "03",
    description: "Task",
  },
  {
    number: "04",
    description: "Command",
  },
];

/**
 * 워크로드 생성 단계 순서 매핑
 */
export const CREATE_WORKLOAD_STEP_ORDER: CreateWorkloadStep[] = [
  "job-type-meta",
  "resource",
  "task",
  "command",
];

/**
 * 워크로드 생성 단계 관련 상수
 */
export const CREATE_WORKLOAD_CONSTANTS = {
  /** 전체 단계 수 */
  TOTAL_STEPS: CREATE_WORKLOAD_STEP_ITEMS.length,
  /** 첫 번째 단계 인덱스 */
  FIRST_STEP_INDEX: 0,
  /** 마지막 단계 인덱스 */
  LAST_STEP_INDEX: CREATE_WORKLOAD_STEP_ITEMS.length - 1,
  /** 단계 순서 */
  STEP_ORDER: CREATE_WORKLOAD_STEP_ORDER,
} as const;
