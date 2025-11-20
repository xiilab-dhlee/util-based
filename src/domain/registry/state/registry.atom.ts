import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 사용자 내부 레지스트리 페이지 번호 */
export const userPrivateRegistryPageAtom = atomWithReset<number>(1);
/** 사용자 내부 레지스트리 검색어 */
export const userPrivateRegistrySearchTextAtom = atom<string>("");
/** 사용자 외부 레지스트리 상태 */
export const userPublicRegistryStatusAtom = atom<string>("");
/** 사용자 외부 레지스트리 검색어 */
export const userPublicRegistrySearchTextAtom = atom<string>("");
/** 이미지 사용 요청 승인 대기 목록 검색어 */
export const userWaitingRequestImageListSearchTextAtom = atom<string>("");
