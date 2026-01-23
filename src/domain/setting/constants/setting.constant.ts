import type {
  ResourceRequestListResponseApprovalStatus,
  WorkspaceMemberSortRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
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

export const SETTING_REQUEST_RESOURCE_SORT_FIELDS = {
  CREATOR_NAME: "creatorName",
  REQUESTED_AT: "requestedAt",
  APPROVAL_STATUS: "approvalStatus",
} as const;

export type SettingRequestResourceSortField =
  (typeof SETTING_REQUEST_RESOURCE_SORT_FIELDS)[keyof typeof SETTING_REQUEST_RESOURCE_SORT_FIELDS];

export const DEFAULT_SETTING_REQUEST_RESOURCE_SORT_STATE = {
  field: SETTING_REQUEST_RESOURCE_SORT_FIELDS.REQUESTED_AT,
  order: "descend",
} satisfies AntdTableSortState<SettingRequestResourceSortField>;

export const WORKSPACE_MEMBER_SORT_FIELD_MAP = {
  accountName: "ACCOUNT_NAME",
  email: "EMAIL",
} as const satisfies Record<string, WorkspaceMemberSortRequestSort>;

export const WORKSPACE_MEMBER_SORT_FIELDS = ["accountName", "email"] as const;

export type WorkspaceMemberSortField =
  keyof typeof WORKSPACE_MEMBER_SORT_FIELD_MAP;

export type WorkspaceMemberSortState =
  AntdTableSortState<WorkspaceMemberSortField>;

export const DEFAULT_WORKSPACE_MEMBER_SORT_STATE = {
  field: "accountName",
  order: "ascend",
} satisfies WorkspaceMemberSortState;
