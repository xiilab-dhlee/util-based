/**
 * 스케줄링 큐 관련 상수
 */

import { GetPendingWorkloadsSort } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/** 긴급 대기열 최대 개수 */
export const MAX_URGENT_QUEUE_SIZE = 5;

// ============================================================================
// 대기중인 워크로드 정렬 관련 상수
// ============================================================================

// TODO: Orval API 스키마 확인 필요 - CREATED_AT 대신 AGE_SECONDS 사용
export const PENDING_WORKLOAD_SORT_FIELD_MAP = {
  createdAt: GetPendingWorkloadsSort.AGE_SECONDS,
} as const satisfies Record<string, GetPendingWorkloadsSort>;

/** 대기중인 워크로드 정렬 필드 타입 */
export type PendingWorkloadSortField =
  keyof typeof PENDING_WORKLOAD_SORT_FIELD_MAP;

/** 대기중인 워크로드 허용 정렬 필드 목록 */
export const PENDING_WORKLOAD_SORT_FIELDS = Object.keys(
  PENDING_WORKLOAD_SORT_FIELD_MAP,
) as PendingWorkloadSortField[];

/** 대기중인 워크로드 정렬 상태 타입 */
export type PendingWorkloadSortState =
  AntdTableSortState<PendingWorkloadSortField>;
