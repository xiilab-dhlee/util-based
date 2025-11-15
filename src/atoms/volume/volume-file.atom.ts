import { atomWithReset } from "jotai/utils";

import {
  createCheckedNodesInfoAtom,
  createSelectedNodeInfoAtom,
} from "@/atoms/common/filetree.atom";
import { ALL_OPTION } from "@/constants/common/core.constant";
import type { FileTreeType } from "@/schemas/filetree.schema";

// 페이지 번호 상태
export const volumeFilePageAtom = atomWithReset<number>(1);

// 워크로드 트리 데이터 상태
export const volumeFileTreeDataAtom = atomWithReset<FileTreeType[]>([]);

// 선택된 노드 상태
export const volumeFileSelectedKeyAtom = atomWithReset<React.Key>(
  ALL_OPTION.value,
);

// 체크된 노드들 상태
export const volumeFileCheckedNodesAtom = atomWithReset<Set<string>>(new Set());

// 현재 선택된 노드 정보 (공통 atom 헬퍼 사용)
export const volumeFileSelectedNodeInfoAtom = createSelectedNodeInfoAtom(
  volumeFileTreeDataAtom,
  volumeFileSelectedKeyAtom,
);

// 체크된 노드들의 정보 (공통 atom 헬퍼 사용)
export const volumeFileCheckedNodesInfoAtom = createCheckedNodesInfoAtom(
  volumeFileTreeDataAtom,
  volumeFileCheckedNodesAtom,
);
