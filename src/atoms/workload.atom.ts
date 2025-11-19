import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import {
  createCheckedNodesInfoAtom,
  createSelectedNodeInfoAtom,
} from "@/atoms/common/filetree.atom";
import { ALL_OPTION } from "@/constants/common/core.constant";
import type { FileTreeType } from "@/schemas/filetree.schema";

/** 워크로드 페이지 번호 */
export const workloadPageAtom = atomWithReset<number>(1);
/** 워크로드 검색어 */
export const workloadSearchTextAtom = atom<string>("");
/** 워크로드 잡타입 */
export const workloadJobTypeAtom = atom<string | null>(null);
/** 워크로드 상태 */
export const workloadStatusAtom = atom<string | null>(null);
/** 커밋 이미지 생성 모달 표시 여부 */
export const openCreateCommitImageModalAtom = atom<boolean>(false);
/** 워크로드 수정 모달 표시 여부 */
export const openUpdateWorkloadModalAtom = atom<boolean>(false);
/** 워크로드 모니터링 모달 표시 여부 */
export const openViewWorkloadMonitoringModalAtom = atom<boolean>(false);
/** 워크로드 모니터링 드로어 표시 여부 */
export const openViewWorkloadMonitoringDrawerAtom = atom<boolean>(false);
/** 워크로드 파일 트리 데이터 */
export const workloadFileTreeDataAtom = atomWithReset<FileTreeType[]>([]);
/** 워크로드 보안 페이지 번호 */
export const workloadSecurityPageAtom = atomWithReset<number>(1);

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
