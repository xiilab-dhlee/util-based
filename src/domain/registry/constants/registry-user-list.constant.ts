import type { GetPrivateImageUsageByAccountSort } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/**
 * 프라이빗 레지스트리 사용자 목록의 페이지당 항목 수
 */
export const REGISTRY_USER_PAGE_SIZE = 20;

/**
 * 사용자별 태그 목록의 페이지당 항목 수
 */
export const REGISTRY_USER_TAG_PAGE_SIZE = 5;
export const REGISTRY_USER_CARD_HEIGHT = 144;

// ============================================================================
// 정렬 관련 상수
// ============================================================================

/** 사용자 목록 정렬 필드 매핑 (테이블 컬럼 키 -> API 정렬 필드) */
export const REGISTRY_USER_SORT_FIELD_MAP = {
  accountName: "ACCOUNT_NAME",
  imageCount: "IMAGE_COUNT",
  usedStorage: "USED_STORAGE",
} as const satisfies Record<string, GetPrivateImageUsageByAccountSort>;

/** 사용자 목록 정렬 필드 타입 */
export type RegistryUserSortField = keyof typeof REGISTRY_USER_SORT_FIELD_MAP;

/** 사용자 목록 허용 정렬 필드 목록 */
export const REGISTRY_USER_SORT_FIELDS = Object.keys(
  REGISTRY_USER_SORT_FIELD_MAP,
) as RegistryUserSortField[];

/** 사용자 목록 정렬 상태 타입 */
export type RegistryUserSortState = AntdTableSortState<RegistryUserSortField>;
