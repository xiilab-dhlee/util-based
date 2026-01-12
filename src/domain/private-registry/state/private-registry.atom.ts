import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 프라이빗 레지스트리 페이지 번호 */
export const privateregistryPageAtom = atomWithReset<number>(1);
/** 프라이빗 레지스트리 검색어 */
export const privateregistrySearchTextAtom = atomWithReset<string>("");
/** 선택된 프라이빗 레지스트리 Harbor 이미지 경로 */
export const privateregistrySelectedItemAtom = atom<string>("");
/** 프라이빗 레지스트리 이미지 페이지 번호 */
export const privateregistryImagePageAtom = atomWithReset<number>(1);
/** 체크된 프라이빗 레지스트리 목록 */
export const privateregistryCheckedListAtom = atomWithReset<Set<number>>(
  new Set(),
);
