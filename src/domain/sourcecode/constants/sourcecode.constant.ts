import type { DropdownOption } from "xiilab-ui";

import {
  type GetSourceCodeListSort,
  SourceCodeListResponseSourceCodeType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortState } from "@/shared/types/core.model";

/** 소스코드 페이지 사이즈 */
export const SOURCECODE_PAGE_SIZE = 20;

/** 소스코드 정렬 필드 매핑 (테이블 컬럼 → API 필드) */
export const SOURCECODE_SORT_FIELD_MAP = {
  sourceCodeName: "SOURCE_CODE_NAME",
  createdAt: "CREATED_AT",
} as const satisfies Record<string, GetSourceCodeListSort>;

/** 소스코드 정렬 필드 배열 */
export const SOURCECODE_SORT_FIELDS = ["sourceCodeName", "createdAt"] as const;

/** 소스코드 정렬 필드 타입 */
export type SourcecodeSortField = keyof typeof SOURCECODE_SORT_FIELD_MAP;

/** 소스코드 정렬 상태 타입 */
export type SourcecodeSortState = AntdTableSortState<SourcecodeSortField>;

/** 소스코드 기본 정렬 상태 */
export const SOURCECODE_DEFAULT_SORT: SourcecodeSortState = {
  field: "createdAt",
  order: "descend",
};

export const SOURCECODE_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: "GitHub",
    value: SourceCodeListResponseSourceCodeType.GITHUB,
  },
  {
    label: "GitLab",
    value: SourceCodeListResponseSourceCodeType.GITLAB,
  },
  {
    label: "Bitbucket",
    value: SourceCodeListResponseSourceCodeType.BITBUCKET,
  },
];
