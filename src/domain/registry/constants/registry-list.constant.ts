import {
  CreateExternalImageRequestRegistryChannel,
  RegistryImageFilterRequestImageSourceType,
  type RegistryImageFilterRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/**
 * 레지스트리 목록의 페이지당 항목 수
 */
export const REGISTRY_PAGE_SIZE = 20;
export const REGISTRY_JOB_PAGE_SIZE = 5;
export const REGISTRY_JOB_CARD_HEIGHT = 122;

export const REGISTRY_SORT_FIELD_MAP = {
  creatorName: "CREATOR_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, RegistryImageFilterRequestSort>;

/** 레지스트리 정렬 필드 타입 */
export type RegistrySortField = keyof typeof REGISTRY_SORT_FIELD_MAP;

/** 레지스트리 허용 정렬 필드 목록 */
export const REGISTRY_SORT_FIELDS = Object.keys(
  REGISTRY_SORT_FIELD_MAP,
) as RegistrySortField[];

/** 레지스트리 정렬 상태 타입 */
export type RegistrySortState = AntdTableSortState<RegistrySortField>;

// ============================================================================
// 이미지 Job 상태 관련 상수
// ============================================================================

/** 이미지 Job 상태 값 */
export const IMAGE_JOB_STATUS = {
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS",
  FAILED: "FAILED",
} as const;

export type ImageJobStatus =
  (typeof IMAGE_JOB_STATUS)[keyof typeof IMAGE_JOB_STATUS];

/** 이미지 Job 상태 레이블 맵 */
export const IMAGE_JOB_STATUS_LABEL: Record<ImageJobStatus, string> = {
  [IMAGE_JOB_STATUS.COMPLETED]: "완료",
  [IMAGE_JOB_STATUS.IN_PROGRESS]: "진행중",
  [IMAGE_JOB_STATUS.FAILED]: "실패",
};

/**
 * 이미지 Job 상태 레이블 반환
 * @param status - 이미지 Job 상태
 * @returns 상태 레이블 (알 수 없는 상태는 원본 값 반환)
 */
export function getImageJobStatusLabel(status: string): string {
  return IMAGE_JOB_STATUS_LABEL[status as ImageJobStatus] ?? status;
}

// ============================================================================
// 이미지 소스 타입 관련 상수
// ============================================================================

/** 이미지 소스 타입 옵션 */
export const IMAGE_SOURCE_TYPE_OPTIONS: {
  label: string;
  value: RegistryImageFilterRequestImageSourceType;
}[] = [
  {
    label: "Snapshot",
    value: RegistryImageFilterRequestImageSourceType.SNAPSHOT,
  },
  {
    label: "External",
    value: RegistryImageFilterRequestImageSourceType.EXTERNAL,
  },
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
