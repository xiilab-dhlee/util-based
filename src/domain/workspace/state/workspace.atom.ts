import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import {
  DEFAULT_WORKSPACE_SORT_STATE,
  type WorkspaceSortField,
} from "@/domain/workspace/constants/workspace.constant";
import type { AntdTableSortState } from "@/shared/types/core.model";

/** 워크스페이스 페이지 번호 */
export const workspacePageAtom = atomWithReset<number>(1);
/** 워크스페이스 검색어 */
export const workspaceSearchTextAtom = atom<string>("");
/** 워크스페이스 정렬 */
export const workspaceSortAtom = atomWithReset<
  AntdTableSortState<WorkspaceSortField>
>(DEFAULT_WORKSPACE_SORT_STATE);

export const workspaceCheckedListAtom = atomWithReset<Set<Key>>(new Set());
/** 리소스 할당량 수정 모달 표시 여부 */
export const openUpdateResourceAllocationModalAtom = atom<boolean>(false);
/** 워크스페이스 수정 모달 표시 여부 */
export const openUpdateWorkspaceModalAtom = atom<boolean>(false);
/** 워크스페이스 삭제 모달 표시 여부 */
export const openDeleteWorkspaceModalAtom = atom<boolean>(false);
/** 관리자용 워크스페이스 일괄 삭제 모달 표시 여부 */
export const openDeleteAdminWorkspacesModalAtom = atom<boolean>(false);
/** 워크스페이스 나가기 모달 표시 여부 */
export const openLeaveWorkspaceModalAtom = atom<boolean>(false);
/** 기본 워크스페이스 설정/해제 모달 표시 여부 */
export const openSetDefaultWorkspaceModalAtom = atom<boolean>(false);
/** 워크스페이스 나가기 시 Owner 권한 이전 필요 모달 표시 여부 */
export const openOwnerTransferRequiredModalAtom = atom<boolean>(false);
