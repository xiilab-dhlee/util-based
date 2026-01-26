import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { RequestResourceSortState } from "@/domain/request-resource/constants/request-resource.constant";
import type { WorkspaceRequestResourceStatus } from "@/domain/workspace/types/workspace.type";

/** 리소스 요청 페이지 번호 */
export const requestResourcePageAtom = atomWithReset<number>(1);

/** 리소스 요청 정렬 상태 */
export const requestResourceSortAtom = atomWithReset<RequestResourceSortState>({
  field: "requestedAt",
  order: "descend",
});

/** 리소스 요청 필터 - 승인 상태 (undefined: 전체, 그 외: 특정 상태) */
export const requestResourceStatusAtom = atomWithReset<
  WorkspaceRequestResourceStatus | undefined
>(undefined);

/** 리소스 요청 필터 - 검색어 */
export const requestResourceKeywordAtom = atomWithReset<string>("");

/** 리소스 승인 모달 표시 여부 */
export const openApproveResourceModalAtom = atom<boolean>(false);

/** 리소스 반려 모달 표시 여부 */
export const openRejectResourceModalAtom = atom<boolean>(false);

/** 리소스 요청 취소(삭제) 모달 표시 여부 */
export const openDeleteRequestResourceModalAtom = atom<boolean>(false);
