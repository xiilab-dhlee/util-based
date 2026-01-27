import type { DropdownOption } from "xiilab-ui";

import type {
  GetAdminResourceRequestsApprovalStatus,
  GetAdminResourceRequestsSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { GetAdminResourceRequestsApprovalStatus as API_STATUS_VALUES } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/** 리소스 요청 쿼리 키 */
export const REQUEST_RESOURCE_QUERY_KEY = "request-resource";

/** 정렬 필드 매핑 (UI → API) */
export const REQUEST_RESOURCE_SORT_FIELD_MAP = {
  requestedAt: "REQUESTED_AT",
  workspaceName: "WORKSPACE_NAME",
} as const satisfies Record<string, GetAdminResourceRequestsSort>;

export const REQUEST_RESOURCE_SORT_FIELDS = [
  "requestedAt",
  "workspaceName",
] as const;

export type RequestResourceSortField =
  keyof typeof REQUEST_RESOURCE_SORT_FIELD_MAP;

export type RequestResourceSortState =
  AntdTableSortState<RequestResourceSortField>;

/** 기본 정렬 설정 */
export const REQUEST_RESOURCE_SORT_DEFAULT = {
  sort: "REQUESTED_AT",
  order: "DESC",
} as const;

/** 리소스 요청 상태 타입 */
export type RequestResourceStatus = GetAdminResourceRequestsApprovalStatus;

/** 리소스 요청 상태 상수 맵 */
export const REQUEST_RESOURCE_STATUS = {
  WAITING: API_STATUS_VALUES.WAITING,
  APPROVED: API_STATUS_VALUES.APPROVED,
  REJECTED: API_STATUS_VALUES.REJECTED,
} as const;

/** 리소스 요청 상태 필터 옵션 */
export const REQUEST_RESOURCE_STATUS_OPTIONS: DropdownOption[] = [
  { label: "대기", value: REQUEST_RESOURCE_STATUS.WAITING },
  { label: "승인", value: REQUEST_RESOURCE_STATUS.APPROVED },
  { label: "반려", value: REQUEST_RESOURCE_STATUS.REJECTED },
];
