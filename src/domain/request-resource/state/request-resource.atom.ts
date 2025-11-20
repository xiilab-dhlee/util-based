import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 리소스 요청 페이지 번호 */
export const requestResourcePageAtom = atomWithReset<number>(1);
/** 리소스 승인 모달 표시 여부 */
export const openApproveResourceModalAtom = atom<boolean>(false);
/** 리소스 반려 모달 표시 여부 */
export const openRejectResourceModalAtom = atom<boolean>(false);
