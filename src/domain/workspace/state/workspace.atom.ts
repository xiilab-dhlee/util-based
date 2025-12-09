import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type {
  WorkloadJobType,
  WorkloadStatusType,
} from "@/domain/workload/schemas/workload.schema";
import type { WorkspaceIdType } from "@/domain/workspace/schemas/workspace.schema";

/** 워크스페이스 페이지 번호 */
export const workspacePageAtom = atomWithReset<number>(1);
/** 워크스페이스 검색어 */
export const workspaceSearchTextAtom = atom<string>("");
/** 워크스페이스 정렬 */
export const workspaceSortAtom = atom<string | null>(null);
/** 체크된 워크스페이스 목록 */
export const workspaceCheckedListAtom = atomWithReset<Set<WorkspaceIdType>>(
  new Set(),
);
/** 리소스 할당량 수정 모달 표시 여부 */
export const openUpdateResourceAllocationModalAtom = atom<boolean>(false);

// ============================================
// 관리자 워크로드 목록 필터
// ============================================

/** 관리자 워크로드 페이지 번호 */
export const adminWorkloadPageAtom = atomWithReset<number>(1);
/** 관리자 워크로드 검색어 */
export const adminWorkloadSearchTextAtom = atom<string>("");
/** 관리자 워크로드 잡타입 */
export const adminWorkloadJobTypeAtom = atom<WorkloadJobType | null>(null);
/** 관리자 워크로드 상태 */
export const adminWorkloadStatusAtom = atom<WorkloadStatusType | null>(null);
