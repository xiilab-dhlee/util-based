import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const sourcecodePageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const sourcecodeSearchTextAtom = atom<string>("");
// 검색 필터 - 소스코드 타입
export const sourcecodeTypeAtom = atom<string>("");
// 체크된 소스코드 목록
export const sourcecodeCheckedListAtom = atomWithReset<Set<number>>(new Set());
// 소스코드 삭제 모달 표시 여부
export const openDeleteSourcecodeModalAtom = atom<boolean>(false);
