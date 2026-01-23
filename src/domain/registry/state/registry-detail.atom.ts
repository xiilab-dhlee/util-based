import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { RegistryTagSortState } from "@/domain/registry/constants/registry-detail.constant";

// ============================================================================
// 레지스트리 태그 관련 상태
// ============================================================================

/** 레지스트리 태그 페이지 번호 */
export const registryTagPageAtom = atomWithReset<number>(1);
/** 레지스트리 태그 검색어 */
export const registryTagSearchTextAtom = atomWithReset<string>("");
/** 레지스트리 태그 정렬 상태 */
export const registryTagSortAtom = atomWithReset<RegistryTagSortState>({
  field: "createdAt",
  order: "descend",
});
/** 체크된 레지스트리 태그 목록 */
export const registryTagCheckedListAtom = atomWithReset<Set<Key>>(new Set());
/** 선택된 레지스트리 태그 */
export const registryTagSelectedAtom =
  atomWithReset<ImageTagListResponse | null>(null);

// ============================================================================
// 레지스트리 취약점 관련 상태
// ============================================================================

/** 레지스트리 취약점 페이지 번호 */
export const registryVulnerabilityPageAtom = atomWithReset<number>(1);
