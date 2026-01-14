import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type { PrivateRegistrySortState } from "@/domain/private-registry/constants/private-registry.constant";

// ============================================================================
// 프라이빗 레지스트리 목록 관련 상태
// ============================================================================

/** 프라이빗 레지스트리 페이지 번호 */
export const privateRegistryPageAtom = atomWithReset<number>(1);
/** 프라이빗 레지스트리 검색 키워드 (입력 중) */
export const privateRegistrySearchKeywordAtom = atom<string>("");
/** 프라이빗 레지스트리 검색어 (검색 실행) */
export const privateRegistrySearchTextAtom = atomWithReset<string>("");
/** 프라이빗 레지스트리 정렬 상태 */
export const privateRegistrySortAtom = atom<PrivateRegistrySortState>({
  field: "createdAt",
  order: "descend",
});
/** 선택된 프라이빗 레지스트리 Harbor 이미지 경로 */
export const privateRegistrySelectedItemAtom = atom<string>("");
/** 체크된 프라이빗 레지스트리 목록 */
export const privateRegistryCheckedListAtom = atomWithReset<Set<Key>>(
  new Set(),
);
/** 프라이빗 레지스트리 구분 선택 모달 열림 상태 */
export const openSelectPrivateRegistryTypeModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 생성 모달 열림 상태 */
export const openCreatePrivateRegistryModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 삭제 모달 열림 상태 */
export const openDeletePrivateRegistryModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 로그 모달 열림 상태 */
export const openPrivateRegistryLogModalAtom = atom<boolean>(false);

// ============================================================================
// Pull/Push Job 관련 상태
// ============================================================================

/** Pull/Push Job 페이지 번호 */
export const pullPushJobPageAtom = atomWithReset<number>(1);
/** Pull/Push Job 검색 키워드 (입력 중) */
export const pullPushJobSearchKeywordAtom = atom<string>("");
/** Pull/Push Job 검색어 (검색 실행) */
export const pullPushJobSearchTextAtom = atomWithReset<string>("");
