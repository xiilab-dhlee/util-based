import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const workspacePageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const workspaceSearchTextAtom = atom<string>("");
// 검색 필터 - 정렬
export const workspaceSortAtom = atom<string>("");
// 체크된 워크스페이스 목록
export const workspaceCheckedListAtom = atomWithReset<Set<string>>(new Set());
