import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { WorkspaceRequestResourceStatus } from "@/domain/workspace/types/workspace.type";
import type { AllOptionValue } from "@/shared/constants/core.constant";

/** 리소스 요청 페이지 번호 */
export const requestResourcePageAtom = atomWithReset<number>(1);
/** 리소스 승인 모달 표시 여부 */
export const openApproveResourceModalAtom = atom<boolean>(false);
/** 리소스 반려 모달 표시 여부 */
export const openRejectResourceModalAtom = atom<boolean>(false);
/** 리소스 요청 취소(삭제) 모달 표시 여부 */
export const openDeleteRequestResourceModalAtom = atom<boolean>(false);

/** 리소스 요청 필터 - 승인 상태 (null: 미선택, ALL: 전체, 그 외: 특정 상태) */
export const requestResourceStatusAtom = atomWithReset<
  WorkspaceRequestResourceStatus | AllOptionValue | null
>(null);
/** 리소스 요청 필터 - 검색어 */
export const requestResourceKeywordAtom = atomWithReset<string>("");
