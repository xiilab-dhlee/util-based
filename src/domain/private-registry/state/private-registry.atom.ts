import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type {
  PrivateRegistrySortState,
  PrivateRegistryTagSortState,
} from "@/domain/private-registry/constants/private-registry.constant";

/** 프라이빗 레지스트리 페이지 번호 */
export const privateregistryPageAtom = atomWithReset<number>(1);
/** 프라이빗 레지스트리 검색 키워드 (입력 중) */
export const privateregistrySearchKeywordAtom = atom<string>("");
/** 프라이빗 레지스트리 검색어 (검색 실행) */
export const privateregistrySearchTextAtom = atomWithReset<string>("");
/** 프라이빗 레지스트리 정렬 상태 */
export const privateregistrySortAtom = atom<PrivateRegistrySortState>({
  field: "createdAt",
  order: "descend",
});
/** 선택된 프라이빗 레지스트리 Harbor 이미지 경로 */
export const privateregistrySelectedItemAtom = atom<string>("");
/** 프라이빗 레지스트리 이미지 페이지 번호 */
export const privateregistryImagePageAtom = atomWithReset<number>(1);
/** 체크된 프라이빗 레지스트리 목록 */
export const privateregistryCheckedListAtom = atomWithReset<Set<Key>>(
  new Set(),
);
/** 프라이빗 레지스트리 구분 선택 모달 열림 상태 */
export const openSelectPrivateRegistryTypeModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 이미지 생성 모달 열림 상태 */
export const openCreatePrivateRegistryModalAtom = atom<boolean>(false);
/** 프라이빗 레지스트리 이미지 삭제 모달 열림 상태 */
export const openDeletePrivateRegistryModalAtom = atom<boolean>(false);
/** Pull/Push Job 페이지 번호 */
export const pullPushJobPageAtom = atomWithReset<number>(1);
/** Pull/Push Job 검색 키워드 (입력 중) */
export const pullPushJobSearchKeywordAtom = atom<string>("");
/** Pull/Push Job 검색어 (검색 실행) */
export const pullPushJobSearchTextAtom = atomWithReset<string>("");

// ============================================================================
// 프라이빗 레지스트리 이미지 태그 상세 관련 상태
// ============================================================================

/** 프라이빗 레지스트리 이미지 태그 페이지 번호 */
export const privateregistryImageTagPageAtom = atomWithReset<number>(1);
/** 프라이빗 레지스트리 이미지 태그 검색어 */
export const privateregistryImageTagSearchTextAtom = atomWithReset<string>("");
/** 프라이빗 레지스트리 이미지 태그 정렬 상태 */
export const privateregistryImageTagSortAtom =
  atom<PrivateRegistryTagSortState>({
    field: "createdAt",
    order: "descend",
  });
/** 체크된 프라이빗 레지스트리 이미지 태그 목록 */
export const privateregistryImageTagCheckedListAtom = atomWithReset<Set<Key>>(
  new Set(),
);
/** 프라이빗 레지스트리 이미지 태그 삭제 모달 열림 상태 */
export const openDeletePrivateRegistryTagModalAtom = atom<boolean>(false);
