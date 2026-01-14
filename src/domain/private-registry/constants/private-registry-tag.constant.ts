import {
  type GetPrivateImageTagListSort,
  ImageTagListResponseApprovalStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

// ============================================================================
// 프라이빗 레지스트리 이미지 태그 관련 상수
// ============================================================================

export const PRIVATE_REGISTRY_TAG_SORT_FIELD_MAP = {
  createdAt: "CREATED_AT",
  imageTagSizeByte: "IMAGE_TAG_SIZE_BYTE",
  vulnerability: "TOTAL_VULNERABILITY_COUNT",
  latestVulnerabilityScanDateTime: "LATEST_SCAN_DATETIME",
} as const satisfies Record<string, GetPrivateImageTagListSort>;

/** 프라이빗 레지스트리 이미지 태그 정렬 필드 타입 */
export type PrivateRegistryTagSortField =
  keyof typeof PRIVATE_REGISTRY_TAG_SORT_FIELD_MAP;

/** 프라이빗 레지스트리 이미지 태그 정렬 상태 타입 */
export type PrivateRegistryTagSortState =
  AntdTableSortState<PrivateRegistryTagSortField>;

// ============================================================================
// 승인 상태 관련 상수
// ============================================================================

/** 프라이빗 레지스트리 태그 승인 상태 텍스트 매핑 */
export const PRIVATE_REGISTRY_TAG_APPROVAL_STATUS_TEXT: Record<
  ImageTagListResponseApprovalStatus,
  string
> = {
  [ImageTagListResponseApprovalStatus.REJECTED]: "반려",
  [ImageTagListResponseApprovalStatus.APPROVAL_REQUIRED]: "승인 필요",
  [ImageTagListResponseApprovalStatus.AVAILABLE]: "요청 가능",
  [ImageTagListResponseApprovalStatus.APPROVAL_WAITING]: "승인 대기",
  [ImageTagListResponseApprovalStatus.APPROVED]: "승인",
  [ImageTagListResponseApprovalStatus.REQUEST_BLOCKED]: "요청 불가",
};
