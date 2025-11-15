import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 내부 레지스트리 페이지 번호
export const privateRegistryPageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const privateRegistrySearchTextAtom = atom<string>("");
// 내부 레지스트리 선택된 레지스트리명
export const privateRegistrySelectedItemAtom = atom<string>("");
// 검색 필터 - 내부 레지스트리 이미지 페이지 번호
export const privateRegistryImagePageAtom = atomWithReset<number>(1);
