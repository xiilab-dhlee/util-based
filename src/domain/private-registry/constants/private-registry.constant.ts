import {
  CreateExternalImageRequestRegistryChannel,
  type GetPrivateImageTagListSort,
  type GetPrivateRegistryListSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/**
 * 프라이빗 레지스트리 목록의 페이지당 항목 수
 */
export const PRIVATE_REGISTRY_PAGE_SIZE = 20;
export const PRIVATE_REGISTRY_JOB_PAGE_SIZE = 5;
export const PRIVATE_REGISTRY_JOB_CARD_HEIGHT = 112;

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
// 프라이빗 레지스트리 구분 관련 상수
// ============================================================================

/** 프라이빗 레지스트리 구분 타입 */
export type PrivateRegistryType = "SNAPSHOT" | "EXTERNAL";

/** 프라이빗 레지스트리 구분 옵션 */
export const PRIVATE_REGISTRY_TYPE_OPTIONS: {
  label: string;
  value: PrivateRegistryType;
}[] = [
  { label: "Snapshot", value: "SNAPSHOT" },
  { label: "External", value: "EXTERNAL" },
];

// ============================================================================
// 레지스트리 채널 관련 상수
// ============================================================================

/** 레지스트리 채널 타입 (orval 생성 타입 재사용) */
export type RegistryChannelType = CreateExternalImageRequestRegistryChannel;

/** 레지스트리 채널 옵션 (Docker Hub, NVIDIA NGC) */
export const REGISTRY_CHANNEL_OPTIONS: {
  label: string;
  value: RegistryChannelType;
}[] = [
  {
    label: "Docker Hub",
    value: CreateExternalImageRequestRegistryChannel.DOCKER,
  },
  { label: "Ngc", value: CreateExternalImageRequestRegistryChannel.NGC },
];
