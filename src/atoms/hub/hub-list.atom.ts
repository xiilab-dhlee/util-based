import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const hubPageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const hubSearchTextAtom = atom<string>("");
// 선택된 허브
export const hubSelectedAtom = atom<number>(-1);
