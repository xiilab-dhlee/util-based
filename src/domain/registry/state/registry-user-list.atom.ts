import { atomWithReset } from "jotai/utils";

import type { RegistryUserSortState } from "@/domain/registry/constants/registry-user-list.constant";

// ============================================================================
// 레지스트리 사용자 목록 관련 상태
// ============================================================================

/** 사용자 목록 페이지 번호 */
export const registryUserPageAtom = atomWithReset<number>(1);
/** 사용자 목록 검색어 (검색 실행) */
export const registryUserSearchTextAtom = atomWithReset<string>("");
/** 선택된 사용자 계정 ID */
export const registryUserSelectedAccountIdAtom = atomWithReset<string>("");
/** 사용자 목록 정렬 상태 */
export const registryUserSortAtom = atomWithReset<RegistryUserSortState>({
  field: "accountName",
  order: "ascend",
});

// ============================================================================
// 사용자별 태그 목록 관련 상태
// ============================================================================

/** 사용자별 태그 목록 페이지 번호 */
export const registryUserTagPageAtom = atomWithReset<number>(1);
