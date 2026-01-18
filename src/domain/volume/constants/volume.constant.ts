import type { DropdownOption } from "xiilab-ui";

import type {
  GetVolumeListOrder,
  GetVolumeListSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

// ============================================================================
// 페이지 설정
// ============================================================================

export const VOLUME_PAGE_SIZE = 15;
export const VOLUME_CARD_HEIGHT = 112;

/** 볼륨 정렬 기본값 (최신순) */
export const VOLUME_DEFAULT_SORT = "CREATED_AT_DESC";

// ============================================================================
// 정렬 옵션
// ============================================================================

/** 정렬 옵션 (Dropdown용) */
export const VOLUME_SORT_OPTIONS: DropdownOption[] = [
  { label: "볼륨 이름순", value: "VOLUME_NAME_ASC" },
  { label: "볼륨 이름 역순", value: "VOLUME_NAME_DESC" },
  { label: "최신순", value: "CREATED_AT_DESC" },
  { label: "오래된순", value: "CREATED_AT_ASC" },
  { label: "파일 크기순", value: "FILE_SIZE_ASC" },
  { label: "파일 크기 역순", value: "FILE_SIZE_DESC" },
];

/** 정렬 값을 API 파라미터로 변환 */
export const parseVolumeSortValue = (
  value: string | null,
): { sort: GetVolumeListSort; order: GetVolumeListOrder } | null => {
  if (!value) return null;

  // 마지막 '_'를 기준으로 분리 (예: "VOLUME_NAME_ASC" → ["VOLUME_NAME", "ASC"])
  const lastUnderscoreIndex = value.lastIndexOf("_");
  const sort = value.slice(0, lastUnderscoreIndex) as GetVolumeListSort;
  const order = value.slice(lastUnderscoreIndex + 1) as GetVolumeListOrder;

  return { sort, order };
};

// ============================================================================
// 볼륨 타입 필터 옵션
// ============================================================================

/** 볼륨 타입 필터 옵션 (Dropdown용) */
export const VOLUME_TYPE_OPTIONS: DropdownOption[] = [
  { label: "AstraGo", value: "ASTRAGO" },
  { label: "On-Premise", value: "ON_PREMISE" },
];

// ============================================================================
// 기타 옵션
// ============================================================================

export const VOLUME_STORAGE_OPTIONS: DropdownOption[] = [
  {
    label: "AstraGo Storage",
    value: "ASTRAGO",
  },
  {
    label: "On-premise Storage",
    value: "LOCAL",
  },
];

export const VOLUME_VISIBILITY_OPTIONS: DropdownOption[] = [
  {
    label: "공개",
    value: "true",
  },
  {
    label: "비공개",
    value: "false",
  },
];
