import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const userPendingPageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const userPendingSearchTextAtom = atom<string>("");
// 검색 필터 - 정렬
export const userPendingSortAtom = atom<string>("");
// 체크된 사용자 목록
export const userPendingCheckedListAtom = atomWithReset<Set<string>>(new Set());
// 사용자 수정 모달 표시 여부
export const openUpdateUserPendingModalAtom = atom<boolean>(false);
