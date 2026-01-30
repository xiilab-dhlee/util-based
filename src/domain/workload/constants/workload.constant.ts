import type { DropdownOption } from "xiilab-ui";

import {
  type ActiveWorkloadResponseWorkloadJobType,
  ActiveWorkloadResponseWorkloadStatus,
  GetActiveWorkloadsOrder,
  GetActiveWorkloadsSort,
  GetTerminatedWorkloadsOrder,
  GetTerminatedWorkloadsSort,
  type TerminatedWorkloadItemReclaimStatus,
  type WorkloadImageDetailImageType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/**
 * 워크로드 노드 모드 상수 (API 스펙: WorkloadCreateRequestNodeType)
 */
export const WORKLOAD_NODE_MODES = {
  SINGLE: "SINGLE",
  MULTI: "MULTI",
} as const;

/**
 * 워크로드 잡 타입 상수
 * Note: Types are defined in generated API schemas (ActiveWorkloadResponseWorkloadJobType)
 */
export const WORKLOAD_JOB_TYPES = {
  BATCH: "BATCH",
  INTERACTIVE: "INTERACTIVE",
  DISTRIBUTED: "DISTRIBUTED",
} as const satisfies Record<string, ActiveWorkloadResponseWorkloadJobType>;

/**
 * 워크로드 이미지 타입 상수
 */
export const WORKLOAD_IMAGE_TYPES = {
  HUB: "HUB",
  BUILT_IN: "BUILT_IN",
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC",
} as const;

/**
 * 기본 이미지 타입
 */
export const DEFAULT_IMAGE_TYPE = WORKLOAD_IMAGE_TYPES.HUB;

/**
 * 워크로드 잡 타입 라벨 상수 (짧은 버전)
 */
export const WORKLOAD_JOB_TYPE_LABEL_MAP: Record<
  ActiveWorkloadResponseWorkloadJobType,
  string
> = {
  BATCH: "Batch",
  INTERACTIVE: "Interactive",
  DISTRIBUTED: "Distributed",
} as const;

/**
 * 워크로드 잡 타입 상세 라벨 상수
 */
export const WORKLOAD_JOB_TYPE_DETAIL_LABEL_MAP: Record<
  ActiveWorkloadResponseWorkloadJobType,
  string
> = {
  BATCH: "Batch Job",
  INTERACTIVE: "Interactive Job (IDE)",
  DISTRIBUTED: "Distributed Job",
} as const;

/**
 * 워크로드 잡 타입별 색상 상수
 */
export const WORKLOAD_JOB_TYPE_COLOR_MAP: Record<
  ActiveWorkloadResponseWorkloadJobType,
  string
> = {
  BATCH: "#2E3452",
  INTERACTIVE: "#2D64DC",
  DISTRIBUTED: "#3FC85B",
} as const;

export const WORKLOAD_JOB_OPTIONS: DropdownOption[] = (
  Object.entries(WORKLOAD_JOB_TYPE_LABEL_MAP) as [
    ActiveWorkloadResponseWorkloadJobType,
    string,
  ][]
).map(([value, label]) => ({
  label,
  value,
}));

/**
 * 워크로드 상태 라벨 상수
 */
export const WORKLOAD_STATUS_LABEL_MAP: Record<
  (typeof ActiveWorkloadResponseWorkloadStatus)[keyof typeof ActiveWorkloadResponseWorkloadStatus],
  string
> = {
  [ActiveWorkloadResponseWorkloadStatus.CREATING]: "생성중",
  [ActiveWorkloadResponseWorkloadStatus.PENDING]: "대기중",
  [ActiveWorkloadResponseWorkloadStatus.RUNNING]: "실행중",
  [ActiveWorkloadResponseWorkloadStatus.TERMINATING]: "종료중",
  [ActiveWorkloadResponseWorkloadStatus.TERMINATED]: "종료",
  [ActiveWorkloadResponseWorkloadStatus.ERROR]: "에러",
} as const;

/**
 * 활성화 워크로드 상태 옵션 (드롭다운용)
 * TERMINATING과 TERMINATED는 활성화 상태가 아니므로 제외
 */
export const ACTIVE_WORKLOAD_STATUS_OPTIONS = [
  {
    label:
      WORKLOAD_STATUS_LABEL_MAP[ActiveWorkloadResponseWorkloadStatus.CREATING],
    value: ActiveWorkloadResponseWorkloadStatus.CREATING,
  },
  {
    label:
      WORKLOAD_STATUS_LABEL_MAP[ActiveWorkloadResponseWorkloadStatus.PENDING],
    value: ActiveWorkloadResponseWorkloadStatus.PENDING,
  },
  {
    label:
      WORKLOAD_STATUS_LABEL_MAP[ActiveWorkloadResponseWorkloadStatus.RUNNING],
    value: ActiveWorkloadResponseWorkloadStatus.RUNNING,
  },
  {
    label:
      WORKLOAD_STATUS_LABEL_MAP[ActiveWorkloadResponseWorkloadStatus.ERROR],
    value: ActiveWorkloadResponseWorkloadStatus.ERROR,
  },
] as const satisfies ReadonlyArray<{
  label: string;
  value: ActiveWorkloadResponseWorkloadStatus;
}>;

/**
 * 활성화 워크로드 정렬 필드 매핑
 * Ant Design 필드명 → API 정렬 필드
 */
export const ACTIVE_WORKLOAD_SORT_FIELD_MAP = {
  workloadName: "WORKLOAD_NAME",
  ageSeconds: "AGE",
} as const satisfies Record<
  (typeof ACTIVE_WORKLOAD_SORT_FIELDS)[number],
  (typeof GetActiveWorkloadsSort)[keyof typeof GetActiveWorkloadsSort]
>;

/**
 * 활성화 워크로드 정렬 가능 필드 배열
 */
export const ACTIVE_WORKLOAD_SORT_FIELDS = [
  "workloadName",
  "ageSeconds",
] as const;

/**
 * 활성화 워크로드 정렬 필드 타입
 */
export type ActiveWorkloadSortField =
  keyof typeof ACTIVE_WORKLOAD_SORT_FIELD_MAP;

/**
 * 활성화 워크로드 정렬 상태 타입
 */
export type ActiveWorkloadSortState =
  AntdTableSortState<ActiveWorkloadSortField>;

/**
 * 활성화 워크로드 기본 정렬 상태 (UI용)
 */
export const DEFAULT_ACTIVE_WORKLOAD_SORT_STATE = {
  field: "ageSeconds",
  order: "ascend",
} as const satisfies ActiveWorkloadSortState;

/**
 * 활성화 워크로드 기본 정렬 (API용)
 */
export const ACTIVE_WORKLOAD_DEFAULT_SORT = {
  sort: GetActiveWorkloadsSort.AGE,
  order: GetActiveWorkloadsOrder.DESC,
} as const;

/** 실행중 워크로드 API 기본 정렬: 생성일 내림차순 */
export const DEFAULT_RUNNING_WORKLOAD_SORT_API = {
  sort: GetActiveWorkloadsSort.AGE,
  order: GetActiveWorkloadsOrder.DESC,
};

/** 실행중 워크로드 목록 페이지 크기 */
export const RUNNING_WORKLOAD_PAGE_SIZE = 10;

/** 워크로드 선택 모달 목록 페이지 크기 */
export const SELECT_WORKLOAD_MODAL_PAGE_SIZE = 10;

/**
 * 비활성화 워크로드 정렬 필드 매핑
 * API 지원 필드: WORKLOAD_NAME, CREATED_AT, TERMINATED_AT (3개 전부)
 */
export const DISABLED_WORKLOAD_SORT_FIELD_MAP = {
  workloadName: "WORKLOAD_NAME",
  createdAt: "CREATED_AT",
  terminatedAt: "TERMINATED_AT",
} as const satisfies Record<
  (typeof DISABLED_WORKLOAD_SORT_FIELDS)[number],
  (typeof GetTerminatedWorkloadsSort)[keyof typeof GetTerminatedWorkloadsSort]
>;

export const DISABLED_WORKLOAD_SORT_FIELDS = [
  "workloadName",
  "createdAt",
  "terminatedAt",
] as const;

export type DisabledWorkloadSortField =
  keyof typeof DISABLED_WORKLOAD_SORT_FIELD_MAP;

export type DisabledWorkloadSortState =
  AntdTableSortState<DisabledWorkloadSortField>;

export const DEFAULT_DISABLED_WORKLOAD_SORT_STATE = {
  field: "terminatedAt",
  order: "descend",
} as const satisfies DisabledWorkloadSortState;

export const DISABLED_WORKLOAD_DEFAULT_SORT = {
  sort: GetTerminatedWorkloadsSort.TERMINATED_AT,
  order: GetTerminatedWorkloadsOrder.DESC,
} as const;

/**
 * 리소스 회수 상태 라벨 매핑
 */
export const RECLAIM_STATUS_LABEL_MAP = {
  RECLAIMED: "회수됨",
  WARNING: "경고",
  NORMAL: "정상",
} as const satisfies Record<TerminatedWorkloadItemReclaimStatus, string>;

/**
 * 리소스 회수 상태 색상 매핑
 */
export const RECLAIM_STATUS_COLOR_MAP = {
  RECLAIMED: "default",
  WARNING: "warning",
  NORMAL: "success",
} as const satisfies Record<TerminatedWorkloadItemReclaimStatus, string>;

/**
 * 워크로드 이미지 타입 라벨 상수
 */
export const WORKLOAD_IMAGE_TYPE_LABEL_MAP: Record<
  WorkloadImageDetailImageType,
  string
> = {
  BUILT_IN: "빌트인 이미지",
  HUB: "허브",
  PRIVATE: "개인 레지스트리",
  PUBLIC: "공유 레지스트리",
} as const satisfies Record<keyof typeof WORKLOAD_IMAGE_TYPES, string>;

/**
 * 잡 타입에 따른 라벨 반환 (워크로드 공용)
 */
export function getJobTypeLabel(
  jobType: ActiveWorkloadResponseWorkloadJobType,
): string {
  return WORKLOAD_JOB_TYPE_LABEL_MAP[jobType] ?? jobType;
}

/**
 * 워크로드 목록 폴링 인터벌 (30초)
 * 활성화/비활성화 워크로드 목록을 자동으로 새로고침하는 주기
 */
export const WORKLOAD_LIST_POLLING_INTERVAL = 30000; // 30 seconds
