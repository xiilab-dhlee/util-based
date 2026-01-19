import type { ResourceRequestListResponseApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/** 워크스페이스 구성원 목록 페이지 크기 */
export const MEMBER_LIST_PAGE_SIZE = 8;

/** 설정 목록 페이지 크기 */
export const SETTING_LIST_PAGE_SIZE = 9;
/** 리소스 요청 목록 페이지 크기 */
export const RESOURCE_REQUEST_LIST_PAGE_SIZE = 9;
/** 크리덴셜 목록 페이지 크기 */
export const CREDENTIAL_LIST_PAGE_SIZE = 6;

/** 승인 상태 라벨 */
export const APPROVAL_STATUS_LABEL = {
  WAITING: "대기",
  APPROVED: "승인",
  REJECTED: "거절",
} as const satisfies Record<ResourceRequestListResponseApprovalStatus, string>;

/** 리소스 요청 정렬 필드 */
export const SETTING_REQUEST_RESOURCE_SORT_FIELDS = {
  REQUESTED_AT: "requestedAt",
  APPROVAL_STATUS: "approvalStatus",
} as const;

export type SettingRequestResourceSortField =
  (typeof SETTING_REQUEST_RESOURCE_SORT_FIELDS)[keyof typeof SETTING_REQUEST_RESOURCE_SORT_FIELDS];

export const DEFAULT_SETTING_REQUEST_RESOURCE_SORT_STATE = {
  field: SETTING_REQUEST_RESOURCE_SORT_FIELDS.REQUESTED_AT,
  order: "descend",
} satisfies AntdTableSortState<SettingRequestResourceSortField>;
