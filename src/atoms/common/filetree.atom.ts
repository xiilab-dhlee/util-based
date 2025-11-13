import { atom } from "jotai";

import type { FileTreeType } from "@/schemas/filetree.schema";

/**
 * 선택된 노드 정보를 반환하는 atom 생성 헬퍼 함수
 *
 * @param treeDataAtom - 트리 데이터 atom
 * @param selectedKeyAtom - 선택된 키 atom
 * @returns 선택된 노드 정보 atom
 */
export function createSelectedNodeInfoAtom<T extends FileTreeType>(
  treeDataAtom: any,
  selectedKeyAtom: any,
) {
  return atom<T | null>((get) => {
    const treeData = get(treeDataAtom);
    const selectedKey = get(selectedKeyAtom);

    if (selectedKey === null) return null;

    // 트리 노드에서 특정 키로 노드를 찾는 재귀 함수
    const findNodeByKey = (nodes: T[], targetKey: React.Key): T | null => {
      for (const node of nodes) {
        if (node.path === targetKey) return node;

        if (node.children?.length) {
          const found = findNodeByKey(node.children as T[], targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    return findNodeByKey(treeData as T[], selectedKey as React.Key);
  });
}

/**
 * 체크된 노드들의 정보를 반환하는 atom 생성 헬퍼 함수
 *
 * @param treeDataAtom - 트리 데이터 atom
 * @param checkedNodesAtom - 체크된 노드들 atom
 * @returns 체크된 노드들의 정보 atom
 */
export function createCheckedNodesInfoAtom<T extends FileTreeType>(
  treeDataAtom: any,
  checkedNodesAtom: any,
) {
  return atom<T[]>((get) => {
    const treeData = get(treeDataAtom);
    const checkedNodes = get(checkedNodesAtom) as Set<string>;

    if (checkedNodes.size === 0) return [];

    const foundNodes: T[] = [];

    const search = (nodeList: T[]) => {
      for (const node of nodeList) {
        if (checkedNodes.has(node.path as string)) {
          foundNodes.push(node);
        }
        if (node.children?.length) {
          search(node.children as T[]);
        }
      }
    };

    search(treeData as T[]);
    return foundNodes;
  });
}
