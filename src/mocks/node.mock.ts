import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import {
  nodeDetailSchema,
  nodeListSchema,
  nodeResourcesSchema,
} from "@/schemas/node.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 노드 목록 모킹 데이터
 */
export const nodeListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(nodeListSchema),
);

/**
 * 노드 상세 모킹 데이터
 */
export const nodeDetailMock = makeMock(nodeDetailSchema);

/**
 * 노드 리소스 모킹 데이터
 */
export const nodeResourcesMock = makeMock(nodeResourcesSchema);
