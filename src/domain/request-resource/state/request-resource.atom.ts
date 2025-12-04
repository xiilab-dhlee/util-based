import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 리소스 요청 페이지 번호 */
export const requestResourcePageAtom = atomWithReset<number>(1);
/** 리소스 승인 모달 표시 여부 */
export const openApproveResourceModalAtom = atom<boolean>(false);
/** 리소스 반려 모달 표시 여부 */
export const openRejectResourceModalAtom = atom<boolean>(false);

/** 리소스 요청 필터 - 시작일시 */
export const requestResourceStartDateAtom = atomWithReset<string>("");
/** 리소스 요청 필터 - 종료일시 */
export const requestResourceEndDateAtom = atomWithReset<string>("");
