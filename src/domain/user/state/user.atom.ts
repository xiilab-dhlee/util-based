import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 사용자 페이지 번호 */
export const userPageAtom = atomWithReset<number>(1);
/** 사용자 검색어 */
export const userSearchTextAtom = atom<string>("");
/** 사용자 정렬 */
export const userSortAtom = atom<string>("");
/** 체크된 사용자 목록 */
export const userCheckedListAtom = atomWithReset<Set<string>>(new Set());
/** 사용자 수정 모달 표시 여부 */
export const openUpdateUserModalAtom = atom<boolean>(false);
/** 승인 대기 페이지 번호 */
export const userPendingPageAtom = atomWithReset<number>(1);
/** 승인 대기 검색어 */
export const userPendingSearchTextAtom = atom<string>("");
/** 승인 대기 정렬 */
export const userPendingSortAtom = atom<string>("");
/** 승인 대기 체크된 사용자 목록 */
export const userPendingCheckedListAtom = atomWithReset<Set<string>>(new Set());
/** 승인 대기 사용자 수정 모달 표시 여부 */
export const openUpdateUserPendingModalAtom = atom<boolean>(false);
