import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const workspaceRequestResourcePageAtom = atomWithReset<number>(1);

// 리소스 승인 모달
export const openApproveResourceModalAtom = atom<boolean>(false);
// 리소스 반려 모달
export const openRejectResourceModalAtom = atom<boolean>(false);
