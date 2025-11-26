import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 내부 레지스트리 페이지 번호 */
export const internalregistryPageAtom = atomWithReset<number>(1);
/** 내부 레지스트리 검색어 */
export const internalregistrySearchTextAtom = atom<string>("");
/** 선택된 내부 레지스트리명 */
export const internalregistrySelectedItemAtom = atom<string>("");
/** 내부 레지스트리 이미지 페이지 번호 */
export const internalregistryImagePageAtom = atomWithReset<number>(1);
