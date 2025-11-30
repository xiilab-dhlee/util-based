import type { SelectedMember } from "@/domain/group/types/group.type";
import {
  GROUP_TREE_NODE_TYPE,
  type GroupTreeType,
} from "@/shared/schemas/group-tree.schema";

/**
 * 트리를 평탄화하여 모든 노드 배열로 반환
 */
export const flattenTree = (nodes: GroupTreeType[]): GroupTreeType[] =>
  nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])]);

/**
 * 트리에서 ID로 노드 찾기
 */
export const findNodeById = (
  nodes: GroupTreeType[],
  targetId: string,
): GroupTreeType | null =>
  flattenTree(nodes).find((node) => node.id === targetId) ?? null;

/**
 * 그룹 노드의 하위 계정 수 계산
 */
export const countAccountsInGroup = (node: GroupTreeType): number => {
  if (node.nodeType === GROUP_TREE_NODE_TYPE.account) {
    return 1;
  }
  return (
    node.children?.reduce(
      (sum, child) => sum + countAccountsInGroup(child),
      0,
    ) ?? 0
  );
};

/**
 * 그룹 노드에서 하위 계정들을 재귀적으로 추출
 */
export const extractAccountsFromGroup = (
  node: GroupTreeType,
): SelectedMember[] => {
  if (node.nodeType === GROUP_TREE_NODE_TYPE.account) {
    return [
      {
        id: node.id,
        name: node.name,
        type: GROUP_TREE_NODE_TYPE.account,
      },
    ];
  }
  return node.children?.flatMap(extractAccountsFromGroup) ?? [];
};
