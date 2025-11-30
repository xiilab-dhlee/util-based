import { faker } from "@faker-js/faker";

import {
  GROUP_TREE_NODE_TYPE,
  type GroupTreeType,
} from "@/shared/schemas/group-tree.schema";

type GroupTreeTemplate = Record<string, unknown>;

/**
 * 계정 노드 생성
 */
function generateAccountNode(name: string): GroupTreeType {
  return {
    id: faker.string.uuid(),
    name,
    nodeType: GROUP_TREE_NODE_TYPE.account,
    children: [],
    email: faker.internet.email({ firstName: name }),
  };
}

/**
 * 그룹 노드 생성
 */
function generateGroupNode(
  name: string,
  children: GroupTreeType[],
): GroupTreeType {
  return {
    id: faker.string.uuid(),
    name,
    nodeType: GROUP_TREE_NODE_TYPE.group,
    children,
  };
}

/**
 * 그룹 트리 생성 (템플릿 기반)
 *
 * 지원하는 구조:
 * - 배열: 계정 리스트 (leaf 노드)
 * - 객체: 하위 그룹
 *
 * @example
 * ```ts
 * const template = {
 *   "그룹 미지정 계정": {
 *     "서비스 개발": {
 *       "AI Model 팀": ["정동주", "김수현", "김민지"],
 *     },
 *   },
 * };
 * const tree = generateGroupTree(template);
 * ```
 *
 * @param template - 그룹 트리 템플릿 객체
 * @returns 생성된 그룹 트리 배열
 */
function createGroupNodesFromEntry([groupName, groupValue]: [
  string,
  unknown,
]): GroupTreeType[] {
  // 배열인 경우: 계정 이름 리스트 → 계정 노드 배열
  if (Array.isArray(groupValue)) {
    const accounts = groupValue
      .filter((name): name is string => typeof name === "string")
      .map((name) => generateAccountNode(name));

    return [generateGroupNode(groupName, accounts)];
  }

  // 객체가 아닌 값은 트리로 해석할 수 없으므로 무시
  if (typeof groupValue !== "object" || groupValue === null) {
    return [];
  }

  // 객체인 경우: 하위 그룹 템플릿 → 재귀적으로 그룹 노드 생성
  const childrenTemplate = groupValue as GroupTreeTemplate;
  const children = generateGroupTree(childrenTemplate);

  return [generateGroupNode(groupName, children)];
}

export function generateGroupTree(
  template: GroupTreeTemplate,
): GroupTreeType[] {
  return Object.entries(template).flatMap(createGroupNodesFromEntry);
}
