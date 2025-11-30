import { faker } from "@faker-js/faker";
import { HttpResponse, http } from "msw";

import { GROUP_TREE_TEMPLATE } from "@/shared/constants/group-tree.constant";
import {
  GROUP_TREE_NODE_TYPE,
  type GroupDetailResponseType,
} from "@/shared/schemas/group-tree.schema";
import { generateGroupTree } from "@/shared/utils/group-tree-generator.util";

// 그룹 트리 데이터 생성 (서버 시작 시 한 번만 생성)
const groupTreeData = generateGroupTree(GROUP_TREE_TEMPLATE);

/**
 * 그룹 API 핸들러
 */
export const groupHandlers = [
  // 그룹 트리 목록 조회
  http.get("/api/v1/core/group", () => {
    return HttpResponse.json({
      content: groupTreeData,
      totalSize: groupTreeData.length,
    });
  }),

  // 그룹 상세 조회
  http.get("/api/v1/core/group/:groupId", ({ params }) => {
    const { groupId } = params;

    // 트리에서 해당 그룹 찾기
    const findGroup = (
      nodes: typeof groupTreeData,
    ): (typeof groupTreeData)[0] | null => {
      for (const node of nodes) {
        if (node.id === groupId) return node;
        if (node.children.length > 0) {
          const found = findGroup(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const group = findGroup(groupTreeData);

    if (!group || group.nodeType !== GROUP_TREE_NODE_TYPE.group) {
      return HttpResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // 그룹 상세 응답 생성
    const response: GroupDetailResponseType = {
      groupName: group.name,
      description: faker.lorem.sentence(),
      creatorId: faker.string.uuid(),
      creatorName: faker.person.fullName(),
      createDateTime: faker.date.past(),
      users: group.children
        .filter((child) => child.nodeType === GROUP_TREE_NODE_TYPE.account)
        .map((account) => ({
          accountId: account.id,
          accountName: account.name,
          email: faker.internet.email({ firstName: account.name }),
        })),
    };

    return HttpResponse.json(response);
  }),
];
