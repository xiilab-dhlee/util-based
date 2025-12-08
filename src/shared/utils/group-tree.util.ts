import type { MemberRow } from "@/shared/components/column/create-member-column";
import {
  GROUP_TREE_NODE_TYPE,
  type GroupTreeType,
} from "@/shared/schemas/group-tree.schema";
import type { SelectedMember } from "@/shared/types/member-selection.type";

/**
 * 트리를 평탄화하여 모든 노드 배열로 반환
 */
export const flattenTree = (nodes: GroupTreeType[]): GroupTreeType[] =>
  nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])]);

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
        email: node.email,
        type: GROUP_TREE_NODE_TYPE.account,
      },
    ];
  }
  return node.children?.flatMap(extractAccountsFromGroup) ?? [];
};

/**
 * 선택된 계정 + 그룹의 하위 계정을 평탄화된 MemberRow 배열로 반환
 * 중복 제거 포함
 *
 * @param selectedAccounts - 선택된 계정 목록
 * @param selectedGroups - 선택된 그룹 목록
 * @param treeData - 전체 그룹 트리 데이터
 * @returns 중복 없는 MemberRow 배열
 */
export const flattenSelectedMembers = (
  selectedAccounts: SelectedMember[],
  selectedGroups: SelectedMember[],
  treeData: GroupTreeType[],
): MemberRow[] => {
  const nodeMap = new Map<string, GroupTreeType>(
    flattenTree(treeData).map((node) => [node.id, node]),
  );

  const memberMap = new Map<string, MemberRow>(
    selectedAccounts.map((a) => [
      a.id,
      { id: a.id, name: a.name, email: a.email },
    ]),
  );

  selectedGroups
    .map((g) => nodeMap.get(g.id))
    .filter((node): node is GroupTreeType => node !== undefined)
    .flatMap(extractAccountsFromGroup)
    .forEach((a) => {
      if (!memberMap.has(a.id)) {
        memberMap.set(a.id, { id: a.id, name: a.name, email: a.email });
      }
    });

  return Array.from(memberMap.values());
};
