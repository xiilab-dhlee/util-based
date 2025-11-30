import { type Atom, atom } from "jotai";

import type { GroupTreeType } from "@/shared/schemas/group-tree.schema";

/**
 * 선택된 그룹 트리 노드 정보를 반환하는 atom 생성 헬퍼 함수
 *
 * @param treeDataAtom - 그룹 트리 데이터 atom
 * @param selectedIdAtom - 선택된 노드 ID atom
 * @returns 선택된 노드 정보 atom
 */
export function createSelectedGroupTreeNodeAtom(
  treeDataAtom: Atom<GroupTreeType[]>,
  selectedIdAtom: Atom<string | null>,
) {
  return atom<GroupTreeType | null>((get) => {
    const treeData = get(treeDataAtom);
    const selectedId = get(selectedIdAtom);

    if (selectedId === null) return null;

    const findNodeById = (
      nodes: GroupTreeType[],
      targetId: string,
    ): GroupTreeType | null => {
      for (const node of nodes) {
        if (node.id === targetId) return node;

        if (node.children?.length) {
          const found = findNodeById(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    return findNodeById(treeData, selectedId);
  });
}
