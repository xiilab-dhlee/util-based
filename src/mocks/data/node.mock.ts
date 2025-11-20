import {
  nodeDetailSchema,
  nodeListSchema,
  nodeResourcesSchema,
} from "@/domain/node/schemas/node.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

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
