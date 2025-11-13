import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import {
  createCheckedNodesInfoAtom,
  createSelectedNodeInfoAtom,
} from "@/atoms/common/filetree.atom";
import coreConstants from "@/constants/common/core.constant";
import type { FileTreeType } from "@/schemas/filetree.schema";

// 그룹 트리 데이터 상태
export const groupTreeDataAtom = atomWithReset<FileTreeType[]>([]);

// 선택된 노드 상태
export const groupSelectedKeyAtom = atomWithReset<React.Key>(
  coreConstants.all.value,
);

// 체크된 노드들 상태
export const groupCheckedNodesAtom = atomWithReset<Set<string>>(new Set());

// 현재 선택된 노드 정보 (공통 atom 헬퍼 사용)
export const groupSelectedNodeInfoAtom = createSelectedNodeInfoAtom(
  groupTreeDataAtom,
  groupSelectedKeyAtom,
);

// 체크된 노드들의 정보 (공통 atom 헬퍼 사용)
export const groupCheckedNodesInfoAtom = createCheckedNodesInfoAtom(
  groupTreeDataAtom,
  groupCheckedNodesAtom,
);

// 그룹 생성 모달 표시 여부
export const openCreateGroupModalAtom = atom<boolean>(false);

// 그룹 삭제 모달 표시 여부
export const openDeleteGroupModalAtom = atom<boolean>(false);
