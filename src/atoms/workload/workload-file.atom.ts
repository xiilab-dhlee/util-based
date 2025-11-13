import { atomWithReset } from "jotai/utils";

import {
  createCheckedNodesInfoAtom,
  createSelectedNodeInfoAtom,
} from "@/atoms/common/filetree.atom";
import { Core } from "@/models/core.model";
import type { FileTreeType } from "@/schemas/filetree.schema";

// 워크로드 트리 데이터 상태
export const workloadFileTreeDataAtom = atomWithReset<FileTreeType[]>([]);

// 선택된 노드 상태
export const workloadFileSelectedKeyAtom = atomWithReset<React.Key>(
  Core.ALL_VALUE,
);

// 체크된 노드들 상태
export const workloadFileCheckedNodesAtom = atomWithReset<Set<string>>(
  new Set(),
);

// 현재 선택된 노드 정보 (공통 atom 헬퍼 사용)
export const workloadFileSelectedNodeInfoAtom = createSelectedNodeInfoAtom(
  workloadFileTreeDataAtom,
  workloadFileSelectedKeyAtom,
);

// 체크된 노드들의 정보 (공통 atom 헬퍼 사용)
export const workloadFileCheckedNodesInfoAtom = createCheckedNodesInfoAtom(
  workloadFileTreeDataAtom,
  workloadFileCheckedNodesAtom,
);
