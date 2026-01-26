import {
  GetUsageRequestListApprovalStatus,
  type GetUsageRequestListSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

// ============================================================================
// 이미지 사용 요청 승인 상태 관련 상수
// ============================================================================

/** 이미지 사용 요청 승인 상태 옵션 */
export const REQUEST_IMAGE_STATUS_OPTIONS: {
  label: string;
  value: GetUsageRequestListApprovalStatus;
}[] = [
  {
    label: "대기",
    value: GetUsageRequestListApprovalStatus.APPROVAL_WAITING,
  },
  {
    label: "승인",
    value: GetUsageRequestListApprovalStatus.APPROVED,
  },
  {
    label: "반려",
    value: GetUsageRequestListApprovalStatus.REJECTED,
  },
];

// ============================================================================
// 이미지 사용 요청 정렬 관련 상수
// ============================================================================

export const REQUEST_IMAGE_SORT_FIELD_MAP = {
  imageDisplayName: "IMAGE_NAME",
  workspaceName: "WORKSPACE_NAME",
  imageTagName: "IMAGE_TAG_NAME",
  vulnerability: "SECURITY_SCAN_RESULT",
  creatorName: "CREATOR_NAME",
  requestedAt: "REQUESTED_AT",
} as const satisfies Record<string, GetUsageRequestListSort>;

/** 이미지 사용 요청 정렬 필드 타입 */
export type RequestImageSortField = keyof typeof REQUEST_IMAGE_SORT_FIELD_MAP;

/** 이미지 사용 요청 허용 정렬 필드 목록 */
export const REQUEST_IMAGE_SORT_FIELDS = Object.keys(
  REQUEST_IMAGE_SORT_FIELD_MAP,
) as RequestImageSortField[];

/** 이미지 사용 요청 정렬 상태 타입 */
export type RequestImageSortState = AntdTableSortState<RequestImageSortField>;
