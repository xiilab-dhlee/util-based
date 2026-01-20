import {
  CreateExternalImageRequestRegistryChannel,
  GetPrivateRegistryListImageSourceType,
  type GetPrivateRegistryListSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/**
 * 프라이빗 레지스트리 목록의 페이지당 항목 수
 */
export const PRIVATE_REGISTRY_PAGE_SIZE = 20;
export const PRIVATE_REGISTRY_JOB_PAGE_SIZE = 5;

export const PRIVATE_REGISTRY_SORT_FIELD_MAP = {
  // imageDisplayName: "IMAGE_NAME",
  creatorName: "CREATOR_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, GetPrivateRegistryListSort>;

/** 프라이빗 레지스트리 정렬 필드 타입 */
export type PrivateRegistrySortField =
  keyof typeof PRIVATE_REGISTRY_SORT_FIELD_MAP;

/** 프라이빗 레지스트리 허용 정렬 필드 목록 */
export const PRIVATE_REGISTRY_SORT_FIELDS = Object.keys(
  PRIVATE_REGISTRY_SORT_FIELD_MAP,
) as PrivateRegistrySortField[];

/** 프라이빗 레지스트리 정렬 상태 타입 */
export type PrivateRegistrySortState =
  AntdTableSortState<PrivateRegistrySortField>;

// ============================================================================
// 이미지 소스 타입 관련 상수
// ============================================================================

/** 이미지 소스 타입 옵션 */
export const IMAGE_SOURCE_TYPE_OPTIONS: {
  label: string;
  value: GetPrivateRegistryListImageSourceType;
}[] = [
  { label: "Snapshot", value: GetPrivateRegistryListImageSourceType.SNAPSHOT },
  { label: "External", value: GetPrivateRegistryListImageSourceType.EXTERNAL },
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
    value: CreateExternalImageRequestRegistryChannel.DOCKER_HUB,
  },
  { label: "Ngc", value: CreateExternalImageRequestRegistryChannel.NGC },
  { label: "Ghcr", value: CreateExternalImageRequestRegistryChannel.GHCR },
];
