import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import {
  createCheckedNodesInfoAtom,
  createSelectedNodeInfoAtom,
} from "@/shared/hooks/filetree.atom";

/** 그룹 트리 데이터 */
export const groupTreeDataAtom = atomWithReset<FileTreeType[]>([]);

/** 그룹 선택된 노드 키 */
export const groupSelectedKeyAtom = atomWithReset<Key>(ALL_OPTION.value);

/** 그룹 체크된 노드들 */
export const groupCheckedNodesAtom = atomWithReset<Set<string>>(new Set());

/** 그룹 선택된 노드 정보 */
export const groupSelectedNodeInfoAtom = createSelectedNodeInfoAtom(
  groupTreeDataAtom,
  groupSelectedKeyAtom,
);

/** 그룹 체크된 노드들 정보 */
export const groupCheckedNodesInfoAtom = createCheckedNodesInfoAtom(
  groupTreeDataAtom,
  groupCheckedNodesAtom,
);

/** 그룹 생성 모달 표시 여부 */
export const openCreateGroupModalAtom = atom<boolean>(false);

/** 그룹 삭제 모달 표시 여부 */
export const openDeleteGroupModalAtom = atom<boolean>(false);
