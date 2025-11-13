import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const requestImagePageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const requestImageSearchTextAtom = atom<string>("");
// 검색 필터 - 상태
export const requestImageStatusAtom = atom<string>("");
// 이미지 요청 승인 모달
export const openApproveRequestImageModalAtom = atom<boolean>(false);
// 이미지 요청 반려 모달
export const openRejectRequestImageModalAtom = atom<boolean>(false);
