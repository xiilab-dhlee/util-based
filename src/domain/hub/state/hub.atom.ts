import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 허브 페이지 번호 */
export const hubPageAtom = atomWithReset<number>(1);
/** 허브 검색어 */
export const hubSearchTextAtom = atom<string>("");
/** 선택된 허브 ID */
export const hubSelectedAtom = atom<number>(-1);
