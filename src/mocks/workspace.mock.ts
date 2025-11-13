import workspaceListConstants from "@/constants/workspace/workspace-list.constant";
import workspaceMemberConstants from "@/constants/workspace/workspace-member.constant";
import workspaceRequestResourceConstants from "@/constants/workspace/workspace-request-resource.constant";
import { workspaceListSchema } from "@/schemas/workspace.schema";
import { workspaceMemberListSchema } from "@/schemas/workspace-member.schema";
import { workspaceRequestResourceListSchema } from "@/schemas/workspace-request-resource.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 워크스페이스 목록 모킹 데이터
 */
export const workspaceListMock = Array.from(
  { length: workspaceListConstants.pageSize },
  () => makeMock(workspaceListSchema),
);

/**
 * 워크스페이스 멤버 목록 모킹 데이터
 */
export const workspaceMemberListMock = Array.from(
  { length: workspaceMemberConstants.pageSize },
  () => makeMock(workspaceMemberListSchema),
);

/**
 * 워크스페이스 리소스 요청 목록 모킹 데이터
 */
export const workspaceRequestResourceListMock = Array.from(
  { length: workspaceRequestResourceConstants.pageSize },
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
