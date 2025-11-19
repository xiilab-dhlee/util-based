import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 소스코드 페이지 번호 */
export const sourcecodePageAtom = atomWithReset<number>(1);
/** 소스코드 검색어 */
export const sourcecodeSearchTextAtom = atom<string>("");
/** 소스코드 타입 */
export const sourcecodeTypeAtom = atom<string | null>(null);
/** 체크된 소스코드 목록 */
export const sourcecodeCheckedListAtom = atomWithReset<Set<number>>(new Set());
/** 소스코드 삭제 모달 표시 여부 */
export const openDeleteSourcecodeModalAtom = atom<boolean>(false);
