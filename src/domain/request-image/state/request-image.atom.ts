import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 이미지 요청 페이지 번호 */
export const requestImagePageAtom = atomWithReset<number>(1);
/** 이미지 요청 검색어 */
export const requestImageSearchTextAtom = atom<string>("");
/** 이미지 요청 상태 */
export const requestImageStatusAtom = atom<string | null>(null);
/** 이미지 요청 승인 모달 표시 여부 */
export const openApproveRequestImageModalAtom = atom<boolean>(false);
/** 이미지 요청 반려 모달 표시 여부 */
export const openRejectRequestImageModalAtom = atom<boolean>(false);
