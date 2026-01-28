import { atom } from "jotai";

import type {
  GetWorkspaceSummaryListOrder,
  GetWorkspaceSummaryListSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/** YAML 로그 모달 표시 여부 */
export const openYamlLogModalAtom = atom<boolean>(false);

// ============================================================
// 워크스페이스 목록 상태
// ============================================================

/** 워크스페이스 목록 페이지 */
export const monitoringWorkspacePageAtom = atom<number>(1);

/** 워크스페이스 목록 정렬 상태 */
export const monitoringWorkspaceSortAtom = atom<{
  sort: GetWorkspaceSummaryListSort;
  order: GetWorkspaceSummaryListOrder;
}>({
  sort: "CREATED_AT",
  order: "DESC",
});

// ============================================================
// 사용자 리소스 목록 상태
// ============================================================

/** 사용자 리소스 목록 페이지 */
export const monitoringUserResourcePageAtom = atom<number>(1);

/** 사용자 리소스 목록 정렬 상태 */
export const monitoringUserResourceSortAtom = atom<{
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}>({
  sortBy: "userName",
  sortDirection: "ASC",
});

// ============================================================
// 활성화 워크로드 목록 상태
// ============================================================

/** 활성화 워크로드 목록 페이지 */
export const monitoringActiveWorkloadPageAtom = atom<number>(1);

/** 활성화 워크로드 목록 정렬 상태 */
export const monitoringActiveWorkloadSortAtom = atom<{
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}>({
  sortBy: "workloadName",
  sortDirection: "ASC",
});
