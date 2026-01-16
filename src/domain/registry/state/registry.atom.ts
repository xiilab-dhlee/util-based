import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 개인 레지스트리 페이지 번호 */
export const userPrivateRegistryPageAtom = atomWithReset<number>(1);
/** 개인 레지스트리 검색 키워드 (입력 중) */
export const userPrivateRegistrySearchKeywordAtom = atom<string>("");
/** 개인 레지스트리 검색어 (검색 실행) */
export const userPrivateRegistrySearchTextAtom = atomWithReset<string>("");

/** 이미지 사용 요청 대기 목록 페이지 번호 */
export const waitingRequestImagePageAtom = atomWithReset<number>(1);
/** 이미지 사용 요청 대기 목록 검색 키워드 (입력 중) */
export const waitingRequestImageSearchKeywordAtom = atom<string>("");
/** 이미지 사용 요청 대기 목록 검색어 (검색 실행) */
export const waitingRequestImageSearchTextAtom = atomWithReset<string>("");
