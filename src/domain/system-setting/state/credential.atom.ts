import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 크리덴셜 페이지 번호 */
export const credentialPageAtom = atomWithReset<number>(1);
/** 크리덴셜 검색어 */
export const credentialSearchTextAtom = atom<string>("");
