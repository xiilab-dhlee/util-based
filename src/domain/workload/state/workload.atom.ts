import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { WorkloadIdType } from "@/domain/workload/schemas/workload.schema";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import {
  createCheckedNodesInfoAtom,
  createSelectedNodeInfoAtom,
} from "@/shared/state/filetree.atom";

/** 워크로드 페이지 번호 */
export const workloadPageAtom = atomWithReset<number>(1);
/** 워크로드 검색어 */
export const workloadSearchTextAtom = atom<string>("");
/** 워크로드 잡타입 */
export const workloadJobTypeAtom = atom<string | null>(null);
/** 워크로드 상태 */
export const workloadStatusAtom = atom<string | null>(null);

/** 비활성화 워크로드 페이지 번호 */
export const workloadDisabledPageAtom = atomWithReset<number>(1);
/** 비활성화 워크로드 검색어 */
export const workloadDisabledSearchTextAtom = atom<string>("");
/** 비활성화 워크로드 잡타입 */
export const workloadDisabledJobTypeAtom = atom<string | null>(null);
/** 비활성화 워크로드 상태 */
export const workloadDisabledStatusAtom = atom<string | null>(null);
/** 커밋 이미지 생성 모달 표시 여부 */
export const openCreateCommitImageModalAtom = atom<boolean>(false);
/** 워크로드 수정 모달 표시 여부 */
export const openUpdateWorkloadModalAtom = atom<boolean>(false);
/** 워크로드 삭제 모달 표시 여부 */
export const openDeleteWorkloadModalAtom = atom<boolean>(false);
/** 워크로드 종료 모달 표시 여부 */
export const openStopWorkloadModalAtom = atom<boolean>(false);
/** 워크로드 재시작 모달 표시 여부 */
export const openRestartWorkloadModalAtom = atom<boolean>(false);
/** 워크로드 모니터링 모달 표시 여부 */
export const openViewWorkloadMonitoringModalAtom = atom<boolean>(false);
/** 워크로드 모니터링 드로어 표시 여부 */
export const openViewWorkloadMonitoringDrawerAtom = atom<boolean>(false);
/** 워크로드 폴더 추가 모달 표시 여부 */
export const openCreateWorkloadFolderModalAtom = atom<boolean>(false);
/** 워크로드 파일 트리 데이터 */
export const workloadFileTreeDataAtom = atomWithReset<FileTreeType[]>([]);
/** 워크로드 보안 페이지 번호 */
export const workloadSecurityPageAtom = atomWithReset<number>(1);
/** 워크로드 선택 모달 - 선택한 워크로드 정보 */
export const selectedWorkloadAtom = atom<WorkloadIdType | null>(null);

/** 워크로드 파일 선택된 노드 키 */
export const workloadFileSelectedKeyAtom = atomWithReset<React.Key>(
  ALL_OPTION.value,
);

/** 워크로드 파일 체크된 노드들 */
export const workloadFileCheckedNodesAtom = atomWithReset<Set<string>>(
  new Set(),
);

/** 워크로드 파일 선택된 노드 정보 */
export const workloadFileSelectedNodeInfoAtom = createSelectedNodeInfoAtom(
  workloadFileTreeDataAtom,
  workloadFileSelectedKeyAtom,
);

/** 워크로드 파일 체크된 노드들 정보 */
export const workloadFileCheckedNodesInfoAtom = createCheckedNodesInfoAtom(
  workloadFileTreeDataAtom,
  workloadFileCheckedNodesAtom,
);
