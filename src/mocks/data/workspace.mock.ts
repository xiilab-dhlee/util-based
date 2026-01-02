import {
  workspaceDetailSchema,
  workspaceListSchema,
} from "@/domain/workspace/schemas/workspace.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

export { createRequestResourceListMock } from "./request-resource.mock";
export { createWorkspaceMemberListMock } from "./workspace-member.mock";

/**
 * 워크스페이스 목록 모킹 데이터
 */
export const workspaceListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(workspaceListSchema),
);

/**
 * 워크스페이스 상세 모킹 데이터
 */
export const workspaceDetailMock = makeMock(workspaceDetailSchema);
