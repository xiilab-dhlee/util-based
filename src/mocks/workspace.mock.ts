import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { workspaceListSchema } from "@/schemas/workspace.schema";
import { workspaceMemberListSchema } from "@/schemas/workspace-member.schema";
import { workspaceRequestResourceListSchema } from "@/schemas/workspace-request-resource.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 워크스페이스 목록 모킹 데이터
 */
export const workspaceListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(workspaceListSchema),
);

/**
 * 워크스페이스 멤버 목록 모킹 데이터
 */
export const workspaceMemberListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(workspaceMemberListSchema),
);

/**
 * 워크스페이스 리소스 요청 목록 모킹 데이터
 */
export const workspaceRequestResourceListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => {
    const mock = makeMock(workspaceRequestResourceListSchema);
    // migGpu 필드를 올바른 형태로 설정
    return {
      ...mock,
      migGpu: [
        { "7g.120gb": 1 },
        { "4g.60gb": 1 },
        { "3g.60gb": 1 },
        { "2g.30gb": 4 },
        { "1g.15gb": 7 },
      ],
    };
  },
);
