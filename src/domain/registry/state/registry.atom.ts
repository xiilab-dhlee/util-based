import { atomWithReset } from "jotai/utils";

import type { RegistryUserSortState } from "../constants/registry-user-list.constant";

// ============================================================================
// Private Registry 관련 Atoms
// ============================================================================

/** 개인 레지스트리 페이지 번호 */
export const userPrivateRegistryPageAtom = atomWithReset<number>(1);
/** 개인 레지스트리 검색어 (검색 실행) */
export const userPrivateRegistrySearchTextAtom = atomWithReset<string>("");
/** 사용자 목록 정렬 상태 */
export const userPrivateRegistrySortAtom = atomWithReset<RegistryUserSortState>(
  {
    field: "accountName",
    order: "ascend",
  },
);

// ============================================================================
// Public Registry 관련 Atoms
// ============================================================================

/** 공개 레지스트리 페이지 번호 */
export const userPublicRegistryPageAtom = atomWithReset<number>(1);
/** 공개 레지스트리 검색어 (검색 실행) */
export const userPublicRegistrySearchTextAtom = atomWithReset<string>("");
/** 공개 레지스트리 사용자 목록 정렬 상태 */
export const userPublicRegistrySortAtom = atomWithReset<RegistryUserSortState>({
  field: "accountName",
  order: "ascend",
});
