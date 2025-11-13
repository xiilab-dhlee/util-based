import nodeListConstants from "@/constants/node/node-list.constant";
import { nodeListSchema } from "@/schemas/node.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 노드 목록 모킹 데이터
 */
export const nodeListMock = Array.from(
  { length: nodeListConstants.pageSize },
  () => makeMock(nodeListSchema),
);
