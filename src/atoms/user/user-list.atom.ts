import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const userPageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const userSearchTextAtom = atom<string>("");
// 검색 필터 - 정렬
export const userSortAtom = atom<string>("");
// 체크된 사용자 목록
export const userCheckedListAtom = atomWithReset<Set<string>>(new Set());
// 사용자 수정 모달 표시 여부
export const openUpdateUserModalAtom = atom<boolean>(false);
