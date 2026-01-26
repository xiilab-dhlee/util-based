import type { DropdownOption } from "xiilab-ui";

import type {
  GetScanHistoryListSort,
  GetScanResultListSort,
  WorkloadReclaimScanHistoryResponseWorkloadJobType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/**
 * 리소스 회수 상세 타입 상수
 * - WARNING: 경고
 * - RECLAIMED: 회수
 */
export const REVOKE_HISTORY_DETAIL_TYPE = {
  WARNING: "WARNING",
  RECLAIMED: "RECLAIMED",
} as const;

/**
 * 리소스 회수 상세 타입 라벨 상수
 */
export const REVOKE_HISTORY_DETAIL_LABEL = {
  WARNING: "경고",
  RECLAIMED: "회수",
} as const;

/**
 * 리소스 회수 상세 타입 드롭다운 옵션
 */
export const REVOKE_HISTORY_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: REVOKE_HISTORY_DETAIL_LABEL.WARNING,
    value: REVOKE_HISTORY_DETAIL_TYPE.WARNING,
  },
  {
    label: REVOKE_HISTORY_DETAIL_LABEL.RECLAIMED,
    value: REVOKE_HISTORY_DETAIL_TYPE.RECLAIMED,
  },
];

/**
 * 리소스 회수 기준 상수
 * - OR: OR 조건
 * - AND: AND 조건
 */
export const REVOKE_CRITERIA = {
  OR: "OR",
  AND: "AND",
} as const;

/**
 * 리소스 회수 기준 기본값
 * UI에서는 최적화 기준을 숨기고, 백엔드에는 항상 OR로 전송합니다.
 */
export const DEFAULT_RECLAIM_OPERATOR = REVOKE_CRITERIA.OR;

/**
 * 워크로드 잡 타입 라벨 매핑
 */
export const REVOKE_JOB_TYPE_LABEL_MAP: Record<
  WorkloadReclaimScanHistoryResponseWorkloadJobType,
  string
> = {
  BATCH: "Batch",
  INTERACTIVE: "Interactive",
  DISTRIBUTED: "Distributed",
} as const;

/**
 * 리소스 회수 이력 잡 타입 드롭다운 옵션
 */
export const REVOKE_JOB_TYPE_OPTIONS: DropdownOption[] = (
  Object.entries(REVOKE_JOB_TYPE_LABEL_MAP) as [
    WorkloadReclaimScanHistoryResponseWorkloadJobType,
    string,
  ][]
).map(([value, label]) => ({
  label,
  value,
}));

/**
 * 잡 타입에 따른 라벨 반환
 */
export function getRevokeJobTypeLabel(
  jobType: WorkloadReclaimScanHistoryResponseWorkloadJobType,
): string {
  return REVOKE_JOB_TYPE_LABEL_MAP[jobType];
}

/**
 * 리소스 회수 이력 상세 정렬 필드 매핑
 */
export const REVOKE_HISTORY_DETAIL_SORT_FIELD_MAP = {
  workloadName: "WORKLOAD_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, GetScanResultListSort>;

/**
 * 리소스 회수 이력 상세 정렬 필드 배열
 */
export const REVOKE_HISTORY_DETAIL_SORT_FIELDS = [
  "workloadName",
  "createdAt",
] as const;

/**
 * 리소스 회수 이력 상세 정렬 필드 타입
 */
export type RevokeHistoryDetailSortField =
  keyof typeof REVOKE_HISTORY_DETAIL_SORT_FIELD_MAP;

/**
 * 리소스 회수 이력 상세 정렬 상태 타입
 */
export type RevokeHistoryDetailSortState =
  AntdTableSortState<RevokeHistoryDetailSortField>;

/**
 * 리소스 회수 이력 목록 정렬 필드 매핑
 */
export const REVOKE_HISTORY_LIST_SORT_FIELD_MAP = {
  createdAt: "CREATED_AT",
} as const satisfies Record<string, GetScanHistoryListSort>;

/**
 * 리소스 회수 이력 목록 정렬 필드 배열
 */
export const REVOKE_HISTORY_LIST_SORT_FIELDS = ["createdAt"] as const;

/**
 * 리소스 회수 이력 목록 정렬 필드 타입
 */
export type RevokeHistoryListSortField =
  keyof typeof REVOKE_HISTORY_LIST_SORT_FIELD_MAP;

/**
 * 리소스 회수 이력 목록 정렬 상태 타입
 */
export type RevokeHistoryListSortState =
  AntdTableSortState<RevokeHistoryListSortField>;
