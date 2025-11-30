import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 사용자 페이지 번호 */
export const accountPageAtom = atomWithReset<number>(1);
/** 사용자 검색어 */
export const accountSearchTextAtom = atom<string>("");
/** 사용자 정렬 */
export const accountSortAtom = atom<string>("");
/** 체크된 사용자 목록 */
export const accountCheckedListAtom = atomWithReset<Set<string>>(new Set());
/** 사용자 수정 모달 표시 여부 */
export const openUpdateAccountModalAtom = atom<boolean>(false);
/** 사용자 삭제 모달 표시 여부 */
export const openDeleteAccountModalAtom = atom<boolean>(false);
/** 승인 대기 페이지 번호 */
export const accountPendingPageAtom = atomWithReset<number>(1);
/** 승인 대기 검색어 */
export const accountPendingSearchTextAtom = atom<string>("");
/** 승인 대기 정렬 */
export const accountPendingSortAtom = atom<string>("");
/** 승인 대기 체크된 사용자 목록 */
export const accountPendingCheckedListAtom = atomWithReset<Set<string>>(
  new Set(),
);
/** 승인 대기 사용자 수정 모달 표시 여부 */
export const openUpdateAccountPendingModalAtom = atom<boolean>(false);
/** 사용자 상태 변경 확인 모달 표시 여부 */
export const openUpdateAccountStatusModalAtom = atom<boolean>(false);
/** 가입 승인 확인 모달 표시 여부 */
export const openApproveAccountPendingModalAtom = atom<boolean>(false);
/** 가입 반려 확인 모달 표시 여부 */
export const openRejectAccountPendingModalAtom = atom<boolean>(false);
/** 계정 상세 정보 모달 표시 여부 */
export const openViewAccountDetailModalAtom = atom<boolean>(false);
