import type { GetPrivateRegistryListSort } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/**
 * 프라이빗 레지스트리 목록의 페이지당 항목 수
 */
export const PRIVATE_REGISTRY_PAGE_SIZE = 20;

export const PRIVATE_REGISTRY_SORT_FIELD_MAP = {
  // imageDisplayName: "IMAGE_NAME",
  creatorName: "CREATOR_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, GetPrivateRegistryListSort>;

/** 프라이빗 레지스트리 정렬 필드 타입 */
export type PrivateRegistrySortField =
  keyof typeof PRIVATE_REGISTRY_SORT_FIELD_MAP;

/** 프라이빗 레지스트리 정렬 상태 타입 */
export type PrivateRegistrySortState =
  AntdTableSortState<PrivateRegistrySortField>;
