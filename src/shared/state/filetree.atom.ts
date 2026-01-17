import { type Atom, atom } from "jotai";

import type { FileTreeType } from "@/shared/schemas/filetree.schema";

/**
 * 트리에서 특정 경로의 노드를 찾는 함수
 *
 * @param nodes - 탐색할 트리 노드 배열
 * @param targetPath - 찾을 노드의 경로
 * @returns 찾은 노드 또는 null
 */
export function findNodeByPath<T extends FileTreeType>(
  nodes: T[],
  targetPath: string,
): T | null {
  for (const node of nodes) {
    if (node.path === targetPath) return node;

    if (node.children?.length) {
      const found = findNodeByPath(node.children as T[], targetPath);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 특정 노드의 모든 하위 노드 경로를 수집하는 함수
 * 자기 자신의 경로도 포함합니다.
 *
 * @param node - 시작 노드
 * @returns 해당 노드와 모든 하위 노드의 경로 배열
 */
export function collectAllDescendantPaths<T extends FileTreeType>(
  node: T,
): string[] {
  const paths: string[] = [node.path];

  if (node.children?.length) {
    for (const child of node.children as T[]) {
      paths.push(...collectAllDescendantPaths(child));
    }
  }

  return paths;
}

/**
 * 트리 데이터에서 특정 경로의 노드와 모든 하위 노드 경로를 수집하는 함수
 *
 * @param treeData - 전체 트리 데이터
 * @param targetPath - 시작할 노드의 경로
 * @returns 해당 노드와 모든 하위 노드의 경로 배열 (노드를 찾지 못하면 빈 배열)
 */
export function getDescendantPathsFromTree<T extends FileTreeType>(
  treeData: T[],
  targetPath: string,
): string[] {
  const node = findNodeByPath(treeData, targetPath);
  if (!node) return [];
  return collectAllDescendantPaths(node);
}

/**
 * 특정 경로의 모든 상위 경로를 반환하는 함수
 *
 * 예: "/folder/subfolder/file.txt" → ["/folder", "/folder/subfolder"]
 *
 * @param path - 대상 경로
 * @returns 상위 경로 배열 (루트 "/" 제외)
 */
export function getAncestorPaths(path: string): string[] {
  const parts = path.split("/").filter(Boolean);
  const ancestors: string[] = [];

  for (let i = 1; i < parts.length; i++) {
    ancestors.push("/" + parts.slice(0, i).join("/"));
  }

  return ancestors;
}

/**
 * 경로 배열에서 최상위 경로만 필터링하는 함수
 *
 * 하위 경로는 상위 경로에 포함되므로, 상위 경로만 남기고 중복을 제거합니다.
 * 예: ["/folder", "/folder/file1", "/folder/file2"] → ["/folder"]
 *
 * @param paths - 필터링할 경로 배열
 * @returns 최상위 경로만 포함된 배열
 */
export function filterToRootPaths(paths: string[]): string[] {
  if (paths.length === 0) return [];

  // 경로 길이순으로 정렬 (짧은 것이 상위 경로)
  const sorted = [...paths].sort((a, b) => a.length - b.length);
  const rootPaths: string[] = [];

  for (const path of sorted) {
    // 이미 추가된 상위 경로의 하위인지 확인
    const isChildOfExisting = rootPaths.some(
      (rootPath) => path.startsWith(`${rootPath}/`) || path === rootPath,
    );

    if (!isChildOfExisting) {
      rootPaths.push(path);
    }
  }

  return rootPaths;
}

/**
 * 선택된 노드 정보를 반환하는 atom 생성 헬퍼 함수
 *
 * @param treeDataAtom - 트리 데이터 atom
 * @param selectedKeyAtom - 선택된 키 atom
 * @returns 선택된 노드 정보 atom
 */
export function createSelectedNodeInfoAtom<T extends FileTreeType>(
  treeDataAtom: Atom<T[]>,
  selectedKeyAtom: Atom<React.Key>,
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
  treeDataAtom: Atom<T[]>,
  checkedNodesAtom: Atom<Set<string>>,
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
